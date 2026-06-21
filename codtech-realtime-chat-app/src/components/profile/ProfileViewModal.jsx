import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { db, rtdb } from "../../services/firebase";
import { X, User, Calendar, AtSign, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ProfileViewModal({ uid, onClose }) {
  const [profile, setProfile] = useState(null);
  const [presence, setPresence] = useState({ state: "offline", lastChanged: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    
    // Fetch static profile data from Firestore
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Listen to real-time presence from RTDB
    const presenceRef = ref(rtdb, `/status/${uid}`);
    const unsubscribePresence = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        setPresence(snapshot.val());
      } else {
        setPresence({ state: "offline", lastChanged: null });
      }
    });

    return () => unsubscribePresence();
  }, [uid]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="neo-bg neo-shadow-sm border border-white/50 rounded-3xl p-6 w-full max-w-sm relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 var-text-muted hover:var-text-primary neo-bg active:neo-pressed rounded-xl transition-colors z-10"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 size={32} className="var-text-muted animate-spin" />
          </div>
        ) : profile ? (
          <div className="flex flex-col items-center mt-4 relative">
            <div className="relative group mb-4">
              <div className="absolute inset-0 neo-blue rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-24 h-24 rounded-full border-4 var-border-color relative z-10 object-cover"
              />
              <div 
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 var-border-color z-20 ${
                  presence.state === "online" ? "bg-emerald-500" : 
                  presence.state === "away" ? "bg-amber-500" : "bg-zinc-500"
                }`}
                title={presence.state === "online" ? "Online" : presence.state === "away" ? "Idle" : "Offline"}
              ></div>
            </div>
            
            <h2 className="text-2xl font-bold var-text-primary text-center">
              {profile.displayName}
            </h2>
            
            <div className="flex items-center var-text-secondary mt-1 mb-4 text-sm neo-pressed px-4 py-1.5 rounded-xl">
              <AtSign size={14} className="mr-1" />
              <span>{profile.username}</span>
            </div>

            <div className="w-full neo-pressed rounded-2xl p-4 mb-4">
              <p className="var-text-primary text-center text-[15px] italic">
                {profile.bio || "No bio yet."}
              </p>
            </div>

            <div className="flex items-center w-full justify-between px-4 py-3 neo-pressed rounded-xl">
              <div className="flex items-center var-text-muted text-xs">
                <Calendar size={14} className="mr-2" />
                <span>Joined {profile.joinedAt && typeof profile.joinedAt.toDate === 'function' ? format(profile.joinedAt.toDate(), "MMM yyyy") : "Unknown"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-white/60">
            <User size={48} className="mb-4 opacity-50" />
            <p>Profile not found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
