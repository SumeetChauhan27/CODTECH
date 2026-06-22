import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Check, CheckCheck, Info, X, Trash2, Pin, Star, Copy, FileText, Pencil } from "lucide-react";
import ProfileViewModal from "../profile/ProfileViewModal";
import ImageLightbox from "./ImageLightbox";
import PinDurationModal from "./PinDurationModal";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮","😭"];

export default function MessageList({ roomData, setEditingMessage }) {
  const [messages, setMessages] = useState([]);
  const [messageLimit, setMessageLimit] = useState(50);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null); 
  const [contextMenu, setContextMenu] = useState(null); // { x, y, msg }
  const [selectedProfileUid, setSelectedProfileUid] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pinMessageData, setPinMessageData] = useState(null);
  const bottomRef = useRef(null);
  const menuRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!roomData?.id) return;
    
    setLoading(true);
    const q = query(
      collection(db, "rooms", roomData.id, "messages"),
      orderBy("createdAt", "desc"),
      limit(messageLimit)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).reverse();
        setMessages(msgs);
        setLoading(false);
        setError("");
        
        // Only scroll to bottom on initial load or if we are already at the bottom
        // This prevents jumping to bottom when loading older messages
        if (messageLimit === 50) {
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
          }, 150);
        }
        setLoadingMore(false);

        msgs.forEach((msg) => {
          const isLegacyArray = Array.isArray(msg.readBy);
          const hasRead = isLegacyArray ? msg.readBy.includes(currentUser.uid) : !!msg.readBy?.[currentUser.uid];
          
          if (msg.uid !== currentUser.uid && !hasRead) {
            updateDoc(doc(db, "rooms", roomData.id, "messages", msg.id), {
              [`readBy.${currentUser.uid}`]: {
                displayName: currentUser.displayName || currentUser.email.split("@")[0],
                time: Date.now()
              }
            }).catch(e => console.error("Could not mark as read", e));
          }
        });
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Could not load messages.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [roomData?.id, currentUser.uid, currentUser.displayName, currentUser.email, messageLimit]);

  // Close context menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReact = async (msgId, emoji, currentReactions) => {
    try {
      const msgRef = doc(db, "rooms", roomData.id, "messages", msgId);
      const reacts = { ...(currentReactions || {}) };
      
      if (!reacts[emoji]) reacts[emoji] = {};
      
      if (reacts[emoji][currentUser.uid]) {
        delete reacts[emoji][currentUser.uid];
        if (Object.keys(reacts[emoji]).length === 0) delete reacts[emoji];
      } else {
        reacts[emoji][currentUser.uid] = {
          displayName: currentUser.displayName || currentUser.email.split("@")[0],
          time: Date.now()
        };
      }
      
      await updateDoc(msgRef, { reactions: reacts });
      setHoveredMsgId(null);
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
    setContextMenu(null);
  };

  const handleContextMenu = (e, msg) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      msg
    });
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomData.id, "messages", msgId));
      setContextMenu(null);
    } catch (err) {
      console.error("Error deleting message", err);
    }
  };

  const handleTogglePin = async (msg) => {
    try {
      if (!msg.isPinned || (msg.pinnedUntil && msg.pinnedUntil <= Date.now())) {
        // Not currently pinned, open modal
        setPinMessageData(msg);
      } else {
        // Pinned, so unpin
        await updateDoc(doc(db, "rooms", roomData.id, "messages", msg.id), {
          isPinned: false,
          pinnedUntil: deleteField()
        });
      }
      setContextMenu(null);
    } catch (err) {
      console.error("Error pinning message", err);
    }
  };

  const handleToggleStar = async (msg) => {
    try {
      const isStarred = msg.starredBy?.includes(currentUser.uid);
      const newStarredBy = isStarred 
        ? (msg.starredBy || []).filter(uid => uid !== currentUser.uid)
        : [...(msg.starredBy || []), currentUser.uid];
        
      await updateDoc(doc(db, "rooms", roomData.id, "messages", msg.id), {
        starredBy: newStarredBy
      });
      setContextMenu(null);
    } catch (err) {
      console.error("Error starring message", err);
    }
  };

  const renderReactions = (reactions) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1 -mb-3 z-10 relative">
        {Object.entries(reactions).map(([emoji, usersMap]) => {
          const userUids = Object.keys(usersMap);
          if (userUids.length === 0) return null;
          return (
            <span 
              key={emoji} 
              className={`
                text-[11px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 cursor-default ring-1 ring-black/5
                ${userUids.includes(currentUser.uid) ? 'bg-blue-50 text-blue-700' : 'var-bg-primary var-text-secondary'}
              `}
            >
              {emoji} <span className="font-semibold">{userUids.length > 1 ? userUids.length : ''}</span>
            </span>
          );
        })}
      </div>
    );
  };

  if (!roomData?.id) {
    return (
      <div className="flex-1 flex items-center justify-center var-bg-secondary">
        <p className="var-text-muted font-medium">Select or create a channel to start chatting</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center var-bg-secondary gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="text-sm var-text-secondary font-medium">Loading messages...</p>
      </div>
    );
  }

  const membersCount = roomData.members?.length || 1;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-7 neo-bg scroll-smooth relative custom-scrollbar">
      {messages.length >= messageLimit && (
        <div className="flex justify-center mb-4">
          <button 
            onClick={() => {
              setLoadingMore(true);
              setMessageLimit(prev => prev + 50);
            }}
            disabled={loadingMore}
            className="px-4 py-2 text-sm font-medium neo-bg neo-shadow-sm var-text-secondary hover:text-blue-500 rounded-xl transition-colors"
          >
            {loadingMore ? "Loading..." : "Load Older Messages"}
          </button>
        </div>
      )}

      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="text-4xl mb-4">✨</div>
            <p className="var-text-primary font-medium text-lg">It's quiet in here.</p>
            <p className="var-text-secondary text-sm">Send a message to kick off the conversation!</p>
          </motion.div>
        </div>
      )}

      {messages.map((msg) => {
        return (
          <MessageBubble 
            key={msg.id}
            msg={msg}
            currentUser={currentUser}
            membersCount={membersCount}
            hoveredMsgId={hoveredMsgId}
            setHoveredMsgId={setHoveredMsgId}
            contextMenu={contextMenu}
            handleContextMenu={handleContextMenu}
            handleReact={handleReact}
            setInfoMsg={setInfoMsg}
            setSelectedImage={setSelectedImage}
            setSelectedProfileUid={setSelectedProfileUid}
          />
        );
      })}
        

      <div ref={bottomRef} className="h-4" />

      {/* Context Menu for Messages */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 neo-bg neo-shadow border border-white/50 rounded-2xl w-48 overflow-hidden py-1 text-sm font-medium"
            style={{ 
              top: Math.min(contextMenu.y, window.innerHeight - 250), 
              left: Math.min(contextMenu.x, window.innerWidth - 200) 
            }}
          >
            <button 
              className="w-full flex items-center px-4 py-2 hover:var-bg-secondary text-zinc-700 transition-colors"
              onClick={() => {
                setInfoMsg(contextMenu.msg);
                setContextMenu(null);
              }}
            >
              <Info className="w-4 h-4 mr-3 var-text-muted" /> Message Info
            </button>
            <button 
              className="w-full flex items-center px-4 py-2 hover:var-bg-secondary text-zinc-700 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(contextMenu.msg.text);
                setContextMenu(null);
              }}
            >
              <Copy className="w-4 h-4 mr-3 var-text-muted" /> Copy Text
            </button>
            <button 
              className="w-full flex items-center px-4 py-2 hover:var-bg-secondary text-zinc-700 transition-colors"
              onClick={() => handleToggleStar(contextMenu.msg)}
            >
              <Star className="w-4 h-4 mr-3 var-text-muted" /> 
              {contextMenu.msg.starredBy?.includes(currentUser.uid) ? "Unstar" : "Star"}
            </button>
            
            {roomData.createdBy === currentUser.uid && (
              <button 
                className="w-full flex items-center px-4 py-2 hover:bg-indigo-500/10 text-indigo-500 transition-colors border-t var-border-color"
                onClick={() => handleTogglePin(contextMenu.msg)}
              >
                <Pin className="w-4 h-4 mr-3 text-indigo-400" /> 
                {(contextMenu.msg.isPinned && (!contextMenu.msg.pinnedUntil || contextMenu.msg.pinnedUntil > Date.now())) ? "Unpin for All" : "Pin for All"}
              </button>
            )}

            {contextMenu.msg.uid === currentUser.uid && (
              <>
                <button 
                  className="w-full flex items-center px-4 py-2 hover:bg-indigo-50 text-indigo-600 transition-colors border-t var-border-color"
                  onClick={() => {
                    setEditingMessage(contextMenu.msg);
                    setContextMenu(null);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-3 text-indigo-400" /> Edit
                </button>
                <button 
                  className="w-full flex items-center px-4 py-2 hover:bg-red-50 text-red-600 transition-colors border-t var-border-color"
                  onClick={() => handleDeleteMessage(contextMenu.msg.id)}
                >
                  <Trash2 className="w-4 h-4 mr-3 text-red-400" /> Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Info Modal */}
      <AnimatePresence>
        {infoMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="var-bg-primary rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden border var-border-color"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b var-border-color">
                <h3 className="font-bold text-lg var-text-primary">Message Info</h3>
                <button onClick={() => setInfoMsg(null)} className="var-text-muted hover:var-text-primary var-bg-secondary p-1.5 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold var-text-muted uppercase tracking-wider mb-3">Read by</h4>
                  <div className="space-y-3">
                    {infoMsg.readBy && !Array.isArray(infoMsg.readBy) ? (
                      Object.entries(infoMsg.readBy)
                        .filter(([uid]) => uid !== infoMsg.uid)
                        .map(([uid, data]) => (
                          <div key={uid} className="flex justify-between items-center text-sm">
                            <span className="font-semibold var-text-primary">{data.displayName}</span>
                            <span className="var-text-secondary text-xs font-medium var-bg-secondary px-2 py-1 rounded-md">{format(data.time, "h:mm a")}</span>
                          </div>
                      ))
                    ) : (
                      <p className="text-sm var-text-secondary italic">No detailed read history.</p>
                    )}
                  </div>
                </div>

                {infoMsg.reactions && Object.keys(infoMsg.reactions).length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold var-text-muted uppercase tracking-wider mb-3 pt-4 border-t var-border-color">Reactions</h4>
                    <div className="space-y-3">
                      {Object.entries(infoMsg.reactions).map(([emoji, usersMap]) => (
                        Object.entries(usersMap).map(([uid, data]) => (
                          <div key={`${emoji}-${uid}`} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 var-bg-secondary px-2 py-1 rounded-md">
                              <span className="text-lg leading-none">{emoji}</span>
                              <span className="font-semibold var-text-primary">{data.displayName}</span>
                            </div>
                            <span className="var-text-secondary text-xs font-medium">{format(data.time, "h:mm a")}</span>
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProfileUid && (
          <ProfileViewModal 
            uid={selectedProfileUid} 
            onClose={() => setSelectedProfileUid(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pinMessageData && (
          <PinDurationModal 
            roomData={roomData}
            message={pinMessageData}
            onClose={() => setPinMessageData(null)}
          />
        )}
      </AnimatePresence>

      <ImageLightbox 
        imageURL={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}

const MessageBubble = React.memo(({ msg, currentUser, membersCount, hoveredMsgId, setHoveredMsgId, contextMenu, handleContextMenu, handleReact, setInfoMsg, setSelectedImage, setSelectedProfileUid }) => {
  const isOwn = msg.uid === currentUser.uid;
  const timeString = msg.createdAt ? format(msg.createdAt.toDate(), "h:mm a") : "Sending...";
  
  const readByUids = Array.isArray(msg.readBy) ? msg.readBy : Object.keys(msg.readBy || {});
  const isFullyRead = readByUids.length >= membersCount;
  const isStarred = msg.starredBy?.includes(currentUser.uid);
  const isPinnedActive = msg.isPinned && (!msg.pinnedUntil || msg.pinnedUntil > Date.now());

  const renderReactions = (reactions) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1 -mb-3 z-10 relative">
        {Object.entries(reactions).map(([emoji, usersMap]) => {
          const userUids = Object.keys(usersMap);
          if (userUids.length === 0) return null;
          return (
            <span 
              key={emoji} 
              className={`
                text-[11px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 cursor-default ring-1 ring-black/5
                ${userUids.includes(currentUser.uid) ? 'bg-blue-50 text-blue-700' : 'var-bg-primary var-text-secondary'}
              `}
            >
              {emoji} <span className="font-semibold">{userUids.length > 1 ? userUids.length : ''}</span>
            </span>
          );
        })}
      </div>
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      id={`msg-${msg.id}`}
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"} relative group`}
      onMouseEnter={() => setHoveredMsgId(msg.id)}
      onMouseLeave={() => setHoveredMsgId(null)}
      onContextMenu={(e) => handleContextMenu(e, msg)}
    >
      {/* Context Indicators (Pinned/Starred) */}
      {(isPinnedActive || isStarred) && (
        <div className={`flex items-center gap-1.5 mb-1 ${isOwn ? 'mr-3' : 'ml-3'}`}>
          {isPinnedActive && <span className="text-[10px] font-bold text-indigo-500 uppercase flex items-center gap-0.5 bg-indigo-500/10 px-1.5 py-0.5 rounded-sm"><Pin className="w-3 h-3"/> Pinned</span>}
          {isStarred && <span className="text-[10px] font-bold text-yellow-500 uppercase flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded-sm"><Star className="w-3 h-3 fill-yellow-400"/> Starred</span>}
        </div>
      )}

      {!isOwn && (
        <button 
          onClick={() => setSelectedProfileUid(msg.uid)}
          className="flex items-center gap-2 mb-1 ml-3 group/author"
        >
          <img 
            src={msg.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.displayName)}`} 
            alt={msg.displayName} 
            className="w-5 h-5 rounded-full object-cover shadow-sm group-hover/author:ring-2 ring-indigo-500/50 transition-all"
          />
          <span className="text-[11px] font-bold var-text-secondary tracking-wide group-hover/author:text-indigo-500 transition-colors">
            {msg.displayName}
          </span>
        </button>
      )}
      
      <div className="flex items-center gap-2 relative">
        {/* Quick React Menu */}
        <AnimatePresence>
          {hoveredMsgId === msg.id && !contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-0 flex items-center var-bg-primary/90 backdrop-blur-md border var-border-color/80 shadow-lg rounded-full px-2 py-1 z-20 ${
                isOwn ? "right-full mr-3" : "left-full ml-3"
              }`}
            >
              {QUICK_REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReact(msg.id, emoji, msg.reactions)}
                  className="hover:scale-125 hover:-translate-y-1 transition-all px-1.5 text-lg"
                >
                  {emoji}
                </button>
              ))}
              <button 
                onClick={() => setInfoMsg(msg)}
                className="ml-1 pl-1.5 border-l var-border-color var-text-muted hover:text-indigo-500 transition-colors"
                title="Message Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`max-w-[85vw] sm:max-w-[60vw] px-4 py-3 relative transition-all cursor-context-menu ${
          isOwn 
            ? "neo-blue rounded-3xl rounded-br-sm" 
            : "neo-bg neo-shadow rounded-3xl rounded-tl-sm border-none"
        } ${isPinnedActive ? 'ring-2 ring-indigo-500/50' : ''}`}>
          {msg.imageURL && (
            <div className="mb-2 -mx-2 -mt-1 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={(e) => { e.stopPropagation(); setSelectedImage(msg.imageURL); }}>
              <img src={msg.imageURL} alt="Shared image" className="max-w-full max-h-64 object-cover" />
            </div>
          )}
          {msg.fileURL && (
            <a 
              href={msg.fileURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black/5 hover:bg-black/10 transition-colors p-3 rounded-xl mb-2 -mx-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-2 rounded-lg ${isOwn ? 'bg-indigo-500 text-white' : 'var-bg-primary text-indigo-500'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{msg.fileName || 'Attachment'}</p>
                <p className={`text-xs ${isOwn ? 'text-indigo-200' : 'var-text-secondary'}`}>
                  {msg.fileSize ? (msg.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Download'}
                </p>
              </div>
            </a>
          )}
          {msg.text && (
            <p className="text-[15px] whitespace-pre-wrap leading-relaxed font-medium tracking-tight">
              {msg.text}
              <span className={`inline-block h-4 ${msg.editedAt ? "w-[80px]" : "w-14"}`} />
            </p>
          )}
          
          <div 
            className="absolute bottom-1 right-2.5 flex items-center gap-1.5 cursor-pointer"
            onClick={() => setInfoMsg(msg)}
          >
            <span className={`text-[10px] font-semibold flex items-center gap-1 ${isOwn ? "text-indigo-200" : "var-text-muted"}`}>
              {msg.editedAt && <span className="opacity-75 italic">(edited)</span>}
              {timeString}
            </span>
            
            {isOwn && (
              <span className="ml-0.5 drop-shadow-sm">
                {isFullyRead ? (
                  <CheckCheck className="w-[15px] h-[15px] text-[#4ade80]" />
                ) : (
                  <Check className="w-[14px] h-[14px] text-white/50" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {renderReactions(msg.reactions)}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.msg.id !== nextProps.msg.id) return false;
  if (prevProps.msg.editedAt !== nextProps.msg.editedAt) return false;
  if (prevProps.msg.isPinned !== nextProps.msg.isPinned) return false;
  if (prevProps.msg.starredBy?.length !== nextProps.msg.starredBy?.length) return false;
  
  const prevReads = Array.isArray(prevProps.msg.readBy) ? prevProps.msg.readBy.length : Object.keys(prevProps.msg.readBy || {}).length;
  const nextReads = Array.isArray(nextProps.msg.readBy) ? nextProps.msg.readBy.length : Object.keys(nextProps.msg.readBy || {}).length;
  if (prevReads !== nextReads) return false;

  const prevReactions = JSON.stringify(prevProps.msg.reactions || {});
  const nextReactions = JSON.stringify(nextProps.msg.reactions || {});
  if (prevReactions !== nextReactions) return false;

  const wasHovered = prevProps.hoveredMsgId === prevProps.msg.id;
  const isHovered = nextProps.hoveredMsgId === nextProps.msg.id;
  if (wasHovered !== isHovered) return false;

  const wasContextMenu = prevProps.contextMenu?.msg?.id === prevProps.msg.id;
  const isContextMenu = nextProps.contextMenu?.msg?.id === nextProps.msg.id;
  if (wasContextMenu !== isContextMenu) return false;

  return true;
});
