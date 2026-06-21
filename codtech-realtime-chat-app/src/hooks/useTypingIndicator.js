import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export function useTypingIndicator(roomId) {
  const { currentUser } = useAuth();
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);

  // Subscribe to typing status of others in the room
  useEffect(() => {
    if (!roomId) return;

    const typingRef = collection(db, 'rooms', roomId, 'typing');
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const currentTyping = [];
      const now = Date.now();
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Ignore our own typing status
        if (docSnap.id === currentUser?.uid) return;
        
        // Filter out stale typing indicators (e.g. older than 10 seconds)
        // If startedAt is somehow null (pending write), we treat it as valid temporarily
        if (!data.startedAt || (now - data.startedAt.toMillis() < 10000)) {
          currentTyping.push(data.displayName);
        }
      });
      
      setTypingUsers(currentTyping);
    });

    return () => unsubscribe();
  }, [roomId, currentUser]);

  // Function to set our own typing status
  const updateTypingStatus = useCallback(async (isTyping) => {
    if (!roomId || !currentUser) return;
    
    const userTypingRef = doc(db, 'rooms', roomId, 'typing', currentUser.uid);
    
    try {
      if (isTyping) {
        await setDoc(userTypingRef, {
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
          startedAt: serverTimestamp()
        });
      } else {
        await deleteDoc(userTypingRef);
      }
    } catch (err) {
      console.error("Error updating typing status:", err);
    }
  }, [roomId, currentUser]);

  // Hook to call on text input change
  const handleTyping = useCallback(() => {
    updateTypingStatus(true);
    
    // Clear typing status after 3 seconds of no activity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 3000);
  }, [updateTypingStatus]);

  // Clean up our typing status when we unmount or change rooms
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (roomId && currentUser) {
        // Use a fire-and-forget delete on unmount
        deleteDoc(doc(db, 'rooms', roomId, 'typing', currentUser.uid)).catch(() => {});
      }
    };
  }, [roomId, currentUser]);

  // Format the display string
  let typingString = "";
  if (typingUsers.length === 1) {
    typingString = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    typingString = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else if (typingUsers.length > 2) {
    typingString = "Several people are typing...";
  }

  return {
    typingString,
    handleTyping,
    clearTyping: () => updateTypingStatus(false)
  };
}
