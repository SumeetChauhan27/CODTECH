import { useState } from "react";
import { X, Clock, Infinity } from "lucide-react";
import { motion } from "framer-motion";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function PinDurationModal({ roomData, message, onClose }) {
  const [loading, setLoading] = useState(false);

  const handlePin = async (hours) => {
    setLoading(true);
    try {
      const payload = { isPinned: true };
      if (hours) {
        payload.pinnedUntil = Date.now() + hours * 60 * 60 * 1000;
      } else {
        payload.pinnedUntil = deleteField(); // Forever
      }
      
      await updateDoc(doc(db, "rooms", roomData.id, "messages", message.id), payload);
      onClose();
    } catch (err) {
      console.error("Error pinning message", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="var-bg-primary w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden border var-border-color"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b var-border-color">
          <h3 className="font-bold text-lg var-text-primary">Pin Message</h3>
          <button onClick={onClose} className="p-1.5 var-text-muted hover:var-text-primary hover:var-bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="var-text-secondary text-sm mb-5 text-center font-medium">
            How long would you like to pin this message?
          </p>
          <div className="space-y-3">
            {[
              { label: "24 Hours", hours: 24, icon: Clock },
              { label: "7 Days", hours: 24 * 7, icon: Clock },
              { label: "30 Days", hours: 24 * 30, icon: Clock },
              { label: "Forever", hours: null, icon: Infinity }
            ].map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  disabled={loading}
                  onClick={() => handlePin(opt.hours)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border var-border-color hover:border-indigo-500 hover:bg-indigo-500/10 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full var-bg-secondary group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 var-text-secondary group-hover:text-indigo-500" />
                    </div>
                    <span className="font-semibold var-text-primary group-hover:text-indigo-400">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
