import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, deleteField } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Pin, X, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PinnedMessageBanner({ roomData, onMessageClick }) {
  const [pinnedMsgs, setPinnedMsgs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!roomData?.id) return;

    const q = query(
      collection(db, "rooms", roomData.id, "messages"),
      where("isPinned", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter out expired pins locally
      const activeMsgs = msgs.filter(m => !m.pinnedUntil || m.pinnedUntil > Date.now());

      if (activeMsgs.length > 0) {
        // Sort locally to avoid needing a composite index
        activeMsgs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA; // newest first
        });
        setPinnedMsgs(activeMsgs);
        setCurrentIndex(prev => prev >= activeMsgs.length ? 0 : prev);
      } else {
        setPinnedMsgs([]);
        setCurrentIndex(0);
      }
    });

    return unsubscribe;
  }, [roomData?.id]);

  if (pinnedMsgs.length === 0) return null;

  const currentMsg = pinnedMsgs[currentIndex];
  const isCreatorOrAdmin = roomData?.createdBy === currentUser?.uid || roomData?.admins?.includes(currentUser?.uid);

  const handleUnpin = async (e) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "rooms", roomData.id, "messages", currentMsg.id), {
        isPinned: false,
        pinnedUntil: deleteField()
      });
    } catch (err) {
      console.error("Error unpinning message", err);
    }
  };

  const handleBannerClick = () => {
    // Scroll to the currently displayed pinned message
    onMessageClick(currentMsg.id);
    // Then immediately update the banner to show the next pinned message
    if (pinnedMsgs.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % pinnedMsgs.length);
    }
  };

  return (
    <div 
      onClick={handleBannerClick}
      className="bg-white/95 backdrop-blur-md border-b border-zinc-200/60 px-4 py-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50 transition-colors z-10 shrink-0 shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <Pin className="w-4 h-4 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wide leading-none mb-1">
            Pinned Message {pinnedMsgs.length > 1 ? `(${currentIndex + 1}/${pinnedMsgs.length})` : ""}
          </span>
          <span className="text-[13px] text-zinc-700 truncate leading-none font-medium">
            {currentMsg.text || (currentMsg.imageURL ? "📷 Photo" : "File attachment")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {pinnedMsgs.length > 1 && (
          <div className="flex gap-1 mr-1">
            {pinnedMsgs.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? "bg-orange-500" : "bg-orange-200"
                }`}
              />
            ))}
          </div>
        )}
        {isCreatorOrAdmin && (
          <button 
            onClick={handleUnpin}
            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Unpin"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
