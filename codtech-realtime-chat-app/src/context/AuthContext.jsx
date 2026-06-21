import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut 
} from "firebase/auth";
import { auth, googleProvider, db, rtdb } from "../services/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, onValue, onDisconnect, set, serverTimestamp as rtdbServerTimestamp } from "firebase/database";
import { useIdle } from "../hooks/useIdle";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use a 5-minute timeout for idle detection
  const isIdle = useIdle(5 * 60 * 1000);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Ensure user document exists in Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // Determine a base username (e.g., from email)
            const baseName = user.displayName || user.email?.split("@")[0] || "user";
            const username = baseName.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);
            
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || baseName,
              username: username,
              bio: "Hey there! I am using ChatFlow.",
              photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || baseName)}&background=random`,
              joinedAt: serverTimestamp(),
              lastSeen: serverTimestamp(),
              isOnline: true,
              fcmTokens: []
            });
          }
        } catch (error) {
          console.error("Error creating/fetching user profile in Firestore:", error);
          // If this fails (e.g., due to missing Firebase security rules), 
          // we still want to let the user log in so the app doesn't freeze.
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Presence system via Realtime Database
  useEffect(() => {
    if (!currentUser) return;

    const userStatusDatabaseRef = ref(rtdb, `/status/${currentUser.uid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }

      onDisconnect(userStatusDatabaseRef).set({
        state: "offline",
        lastChanged: rtdbServerTimestamp(),
      }).then(() => {
        set(userStatusDatabaseRef, {
          state: isIdle ? "away" : "online",
          lastChanged: rtdbServerTimestamp(),
        });
      });
    });

    return () => {
      set(userStatusDatabaseRef, {
        state: "offline",
        lastChanged: rtdbServerTimestamp(),
      });
      unsubscribe();
    };
  }, [currentUser]); // We don't want to re-run the whole connection setup when isIdle changes

  // Update RTDB when isIdle changes, but only if we are connected
  useEffect(() => {
    if (!currentUser) return;
    
    // We just write to RTDB. If we're disconnected, it will fail silently or queue,
    // which is fine because onDisconnect handles actual disconnects.
    const userStatusDatabaseRef = ref(rtdb, `/status/${currentUser.uid}`);
    set(userStatusDatabaseRef, {
      state: isIdle ? "away" : "online",
      lastChanged: rtdbServerTimestamp(),
    }).catch(console.error);
    
  }, [isIdle, currentUser]);

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    setCurrentUser({ ...userCredential.user, displayName });
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
