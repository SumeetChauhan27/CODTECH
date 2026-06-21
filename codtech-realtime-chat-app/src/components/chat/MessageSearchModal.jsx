import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Search, X, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function MessageSearchModal({ roomData, onClose, onMessageClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim() || !roomData?.id) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Firebase doesn't have native full-text search.
      // For this project, we fetch the recent messages and filter client-side.
      const q = query(
        collection(db, "rooms", roomData.id, "messages"),
        orderBy("createdAt", "desc"),
        limit(1000)
      );
      
      const snapshot = await getDocs(q);
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const matched = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.text && data.text.toLowerCase().includes(lowerSearchTerm)) {
          matched.push({ id: doc.id, ...data });
        }
      });
      
      setResults(matched);
    } catch (error) {
      console.error("Error searching messages:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="neo-bg rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/50"
      >
        
        <form onSubmit={handleSearch} className="flex items-center px-4 py-3 border-b var-border-color var-bg-secondary/50">
          <Search className="w-5 h-5 var-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages in this room... (Press Enter)"
            className="flex-1 bg-transparent border-none focus:outline-none var-text-primary placeholder:var-text-muted text-[15px]"
          />
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 var-text-muted hover:var-text-primary hover:bg-zinc-200/50 rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2 var-bg-primary">
          {!hasSearched && (
            <div className="flex flex-col items-center justify-center py-12 var-text-secondary">
              <Search className="w-10 h-10 text-zinc-200 mb-4" />
              <p className="text-sm font-medium">Type a keyword and press Enter to search</p>
              <p className="text-xs var-text-muted mt-1">Searches the last 1000 messages</p>
            </div>
          )}

          {isSearching && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          {hasSearched && !isSearching && results.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
              <p className="var-text-secondary font-medium text-sm">No messages found for "{searchTerm}"</p>
            </div>
          )}

          {hasSearched && !isSearching && results.length > 0 && (
            <div className="space-y-1 p-2">
              {results.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => onMessageClick && onMessageClick(msg.id)}
                  className="p-3 hover:var-bg-secondary rounded-xl transition-colors border border-transparent hover:var-border-color group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src={msg.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.displayName)}`} 
                        alt={msg.displayName} 
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[13px] font-bold text-zinc-700">{msg.displayName}</span>
                    </div>
                    <span className="text-[11px] font-semibold var-text-muted">
                      {msg.createdAt ? format(msg.createdAt.toDate(), "MMM d, h:mm a") : ""}
                    </span>
                  </div>
                  <p className="text-[14px] var-text-primary line-clamp-2 leading-relaxed ml-7">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {hasSearched && !isSearching && results.length > 0 && (
          <div className="px-4 py-2 var-bg-secondary border-t var-border-color text-xs var-text-secondary font-medium flex justify-between">
            <span>Found {results.length} result(s)</span>
            <span>ESC to close</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
