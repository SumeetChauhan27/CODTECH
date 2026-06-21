import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { X, User, Calendar, AtSign, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ProfileViewModal({ uid, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    
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
  }, [uid]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 size={32} className="text-white/60 animate-spin" />
          </div>
        ) : profile ? (
          <div className="flex flex-col items-center mt-4">
            <div className="relative group mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-24 h-24 rounded-full border-2 border-white/20 relative z-10 object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center">
              {profile.displayName}
            </h2>
            
            <div className="flex items-center text-white/60 mt-1 mb-4 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <AtSign size={14} className="mr-1" />
              <span>{profile.username}</span>
            </div>

            <div className="w-full bg-black/20 rounded-xl p-4 mb-4 border border-white/5">
              <p className="text-white/80 text-center text-sm italic">
                {profile.bio || "No bio yet."}
              </p>
            </div>

            <div className="flex items-center w-full justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center text-white/50 text-xs">
                <Calendar size={14} className="mr-2" />
                <span>Joined</span>
              </div>
              <span className="text-white/80 text-sm font-medium">
                {profile.joinedAt ? format(profile.joinedAt.toDate(), "MMM d, yyyy") : "Recently"}
              </span>
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
