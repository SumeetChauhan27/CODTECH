import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { X, User, AtSign, Loader2, Save, Type, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function ProfileEditModal({ onClose }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    photoURL: ""
  });

  useEffect(() => {
    if (!currentUser?.uid) return;
    
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            displayName: data.displayName || "",
            username: data.username || "",
            bio: data.bio || "",
            photoURL: data.photoURL || currentUser.photoURL
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim() || !formData.username.trim()) {
      setError("Name and username are required.");
      return;
    }
    
    // Simple username validation
    const usernameRegex = /^[a-z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError("Username can only contain lowercase letters, numbers, and underscores.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim()
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl"
      >
        <button
          onClick={onClose}
          disabled={saving}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10 disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <User size={20} className="mr-2" /> Edit Profile
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 size={32} className="text-white/60 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img 
                  src={formData.photoURL} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full border-2 border-white/20 object-cover"
                />
                {/* Note: Avatar upload will come in Phase 4 (Image Sharing) */}
              </div>
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">{error}</div>}
            {success && <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm">{success}</div>}

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Display Name</label>
              <div className="relative">
                <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Bio</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-white/40" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={160}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="text-right text-xs text-white/40 pr-1">
                {formData.bio.length}/160
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all flex justify-center items-center disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Profile</>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
