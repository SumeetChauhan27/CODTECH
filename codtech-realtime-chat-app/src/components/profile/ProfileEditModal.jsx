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
        className="neo-bg neo-shadow-sm border border-white/50 rounded-3xl p-6 w-full max-w-sm relative overflow-hidden"
      >
        <button
          onClick={onClose}
          disabled={saving}
          className="absolute top-4 right-4 p-2 var-text-muted hover:var-text-primary rounded-xl transition-colors z-10 disabled:opacity-50 neo-bg active:neo-pressed"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold var-text-primary mb-6 flex items-center">
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
              <label className="text-xs font-medium var-text-secondary uppercase tracking-wider ml-1">Display Name</label>
              <div className="relative">
                <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 var-text-muted" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full neo-pressed border-none rounded-xl py-3 pl-10 pr-4 var-text-primary placeholder:var-text-muted focus:outline-none"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium var-text-secondary uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 var-text-muted" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full neo-pressed border-none rounded-xl py-3 pl-10 pr-4 var-text-primary placeholder:var-text-muted focus:outline-none"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium var-text-secondary uppercase tracking-wider ml-1">Bio</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 var-text-muted" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={160}
                  className="w-full neo-pressed border-none rounded-xl py-2 pl-10 pr-4 var-text-primary placeholder:var-text-muted focus:outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="text-right text-xs var-text-muted pr-1">
                {formData.bio.length}/160
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl neo-bg neo-shadow-sm font-medium var-text-primary hover:text-blue-500 active:neo-pressed transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl neo-blue font-medium text-white shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
