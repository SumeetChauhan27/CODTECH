import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { X, Pin } from "lucide-react";
import { format } from "date-fns";

export default function PinnedMessagesPanel({ roomData, onClose }) {
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomData?.id) return;

    const q = query(
      collection(db, "rooms", roomData.id, "messages"),
      where("isPinned", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by createdAt client-side to avoid needing a composite index in Firestore
      // (which would be required if we did orderBy("createdAt") along with where("isPinned"))
      msgs.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      });
      setPinnedMessages(msgs);
      setLoading(false);
    });

    return unsubscribe;
  }, [roomData?.id]);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 var-bg-primary border-l var-border-color/60 shadow-xl z-30 flex flex-col animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between px-6 py-5 border-b var-border-color shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
            <Pin className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="font-bold var-text-primary tracking-tight">Pinned Messages</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 var-text-muted hover:var-text-primary hover:var-bg-secondary rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 var-bg-secondary/50">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : pinnedMessages.length === 0 ? (
          <div className="text-center py-8">
            <Pin className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="var-text-secondary font-medium text-sm">No pinned messages in this room yet.</p>
          </div>
        ) : (
          pinnedMessages.map((msg) => (
            <div key={msg.id} className="var-bg-primary p-4 rounded-2xl shadow-sm border var-border-color flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={msg.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.displayName)}`} 
                    alt={msg.displayName} 
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[12px] font-bold text-zinc-700">{msg.displayName}</span>
                </div>
                <span className="text-[10px] font-semibold var-text-muted">
                  {msg.createdAt ? format(msg.createdAt.toDate(), "MMM d, h:mm a") : "Just now"}
                </span>
              </div>
              
              {msg.text && (
                <p className="text-[14px] var-text-primary whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>
              )}
              
              {msg.imageURL && (
                <div className="mt-2 rounded-xl overflow-hidden border var-border-color">
                  <img src={msg.imageURL} alt="Attachment" className="max-w-full object-cover" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
