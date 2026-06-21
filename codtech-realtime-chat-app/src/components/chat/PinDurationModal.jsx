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
        className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden border border-zinc-100"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="font-bold text-lg text-zinc-900">Pin Message</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-zinc-500 text-sm mb-5 text-center font-medium">
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
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-zinc-200 hover:border-orange-500 hover:bg-orange-50 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-zinc-500 group-hover:text-orange-600" />
                    </div>
                    <span className="font-semibold text-zinc-800 group-hover:text-orange-700">{opt.label}</span>
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
