import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Hash, Plus, MessageSquare, Key, Trash2, LogOut, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinStatus, setJoinStatus] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  
  const navigate = useNavigate();
  const { roomId: currentRoomId } = useParams();
  const { currentUser } = useAuth();
  const menuRef = useRef(null);
  const prevRoomsRef = useRef({});

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "rooms"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const myRooms = fetchedRooms.filter(r => r.members && r.members.includes(currentUser.uid));
      
      myRooms.forEach(room => {
        const oldRoom = prevRoomsRef.current[room.id];
        if (oldRoom && room.lastMessage) {
          const newTime = room.lastMessage.createdAt?.toMillis() || 0;
          const oldTime = oldRoom.lastMessage?.createdAt?.toMillis() || 0;
          if (newTime > oldTime && room.lastMessage.senderUid !== currentUser.uid) {
            // New message!
            if (currentRoomId !== room.id || document.hidden) {
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification(`New message in #${room.name}`, {
                  body: `${room.lastMessage.senderName}: ${room.lastMessage.text}`
                });
              }
            }
          }
        }
        prevRoomsRef.current[room.id] = room;
      });

      setAllRooms(fetchedRooms);
      setRooms(myRooms);
      
      if (myRooms.length > 0 && !currentRoomId) {
        navigate(`/chat/${myRooms[0].id}`, { replace: true });
      }
    });
    return unsubscribe;
  }, [currentRoomId, navigate, currentUser.uid]);

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

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        name: newRoomName.trim().toLowerCase().replace(/\s+/g, '-'),
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        members: [currentUser.uid],
        pendingRequests: [],
        inviteCode: generateInviteCode()
      });
      setNewRoomName("");
      setIsCreating(false);
      navigate(`/chat/${docRef.id}`);
      setIsMobileOpen(false);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoinStatus("");

    const targetRoom = allRooms.find(r => r.inviteCode === joinCode.trim().toUpperCase());
    
    if (!targetRoom) {
      setJoinStatus("Invalid code");
      return;
    }

    if (targetRoom.members?.includes(currentUser.uid)) {
      setJoinStatus("Already a member");
      navigate(`/chat/${targetRoom.id}`);
      setIsMobileOpen(false);
      return;
    }

    try {
      await updateDoc(doc(db, "rooms", targetRoom.id), {
        pendingRequests: arrayUnion({
          uid: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || ""
        })
      });
      setJoinStatus("Request sent! Waiting for approval.");
      setTimeout(() => {
        setIsJoining(false);
        setJoinCode("");
        setJoinStatus("");
      }, 3000);
    } catch (err) {
      console.error("Error joining:", err);
      setJoinStatus("Error sending request");
    }
  };

  const handleContextMenu = (e, room) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      room
    });
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      if (currentRoomId === roomId) {
        navigate('/chat');
      }
      setContextMenu(null);
    } catch (err) {
      console.error("Error deleting room", err);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      await updateDoc(doc(db, "rooms", roomId), {
        members: arrayRemove(currentUser.uid)
      });
      if (currentRoomId === roomId) {
        navigate('/chat');
      }
      setContextMenu(null);
    } catch (err) {
      console.error("Error leaving room", err);
    }
  };

  return (
    <div className={`
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0
      fixed md:static inset-y-0 left-0 z-40
      w-64 bg-zinc-900 text-zinc-300 flex flex-col transition-transform duration-300 ease-in-out
    `}>
      <div className="h-[72px] flex items-center px-6 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <MessageSquare className="w-6 h-6 text-indigo-500 mr-3 drop-shadow-md" />
        <h1 className="font-bold text-xl text-white tracking-tight">ChatFlow</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto scrollbar-thin">
        {/* Actions Header */}
        <div className="flex items-center justify-between mb-4 px-2 mt-2">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Channels</span>
          <div className="flex gap-1">
            <button 
              onClick={() => { setIsJoining(!isJoining); setIsCreating(false); }}
              className={`p-1.5 rounded-lg transition-all ${isJoining ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white active:scale-95'}`}
              title="Join a room with code"
            >
              <Key className="w-[15px] h-[15px]" />
            </button>
            <button 
              onClick={() => { setIsCreating(!isCreating); setIsJoining(false); }}
              className={`p-1.5 rounded-lg transition-all ${isCreating ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white active:scale-95'}`}
              title="Create a new room"
            >
              <Plus className="w-[15px] h-[15px]" />
            </button>
          </div>
        </div>

        {/* Create Room Form */}
        <AnimatePresence>
          {isCreating && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-2 overflow-hidden"
              onSubmit={handleCreateRoom}
            >
              <input
                type="text"
                autoFocus
                placeholder="Room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600 shadow-inner"
              />
              <button type="submit" className="w-full mt-2 bg-indigo-600 text-white text-xs font-bold tracking-wide py-2 rounded-xl hover:bg-indigo-500 transition-colors active:scale-95">
                Create
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Join Room Form */}
        <AnimatePresence>
          {isJoining && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-2 overflow-hidden"
              onSubmit={handleJoinRoom}
            >
              <input
                type="text"
                autoFocus
                placeholder="Enter 10-digit code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={10}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 shadow-inner"
              />
              {joinStatus && (
                <p className={`text-[10px] mt-1.5 font-medium ${joinStatus.includes('sent') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {joinStatus}
                </p>
              )}
              <button type="submit" className="w-full mt-2 bg-zinc-800 text-white text-xs font-bold tracking-wide py-2 rounded-xl hover:bg-zinc-700 transition-colors active:scale-95 border border-zinc-700">
                Request to Join
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-0.5">
          {rooms.map(room => {
            const msgTime = room.lastMessage?.createdAt?.toMillis ? room.lastMessage.createdAt.toMillis() : Date.now();
            const readTime = room.lastReadAt?.[currentUser.uid]?.toMillis ? room.lastReadAt[currentUser.uid].toMillis() : 0;
            const hasUnread = currentRoomId !== room.id && room.lastMessage && msgTime > readTime;
            
            return (
              <button
                key={room.id}
                onClick={() => {
                  navigate(`/chat/${room.id}`);
                  setIsMobileOpen(false);
                }}
                onContextMenu={(e) => handleContextMenu(e, room)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all text-sm font-semibold group relative ${
                  currentRoomId === room.id 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Hash className={`w-4 h-4 mr-3 shrink-0 transition-opacity ${hasUnread ? 'opacity-100 text-indigo-400' : 'opacity-50 group-hover:opacity-100'}`} />
                <span className={`truncate tracking-tight ${hasUnread ? 'text-white' : ''}`}>{room.name}</span>
                {hasUnread && (
                  <div className="absolute right-3 w-2 h-2 rounded-full bg-indigo-500"></div>
                )}
              </button>
            );
          })}
          {rooms.length === 0 && !isCreating && !isJoining && (
            <div className="text-xs text-zinc-500 px-2 mt-6 text-center font-medium bg-zinc-950 py-4 rounded-xl border border-zinc-800/50">
              You are not in any rooms. Join or create one!
            </div>
          )}
        </div>
      </div>

      {/* Room Context Menu */}
      {contextMenu && (
        <div 
          ref={menuRef}
          className="fixed z-50 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl w-48 overflow-hidden py-1 text-sm font-medium animate-in fade-in zoom-in-95 duration-100"
          style={{ 
            top: Math.min(contextMenu.y, window.innerHeight - 150), 
            left: Math.min(contextMenu.x, window.innerWidth - 200) 
          }}
        >
          <button 
            className="w-full flex items-center px-4 py-2 hover:bg-zinc-800 text-zinc-300 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(contextMenu.room.inviteCode);
              setContextMenu(null);
            }}
          >
            <Copy className="w-4 h-4 mr-3 text-zinc-400" /> Copy Invite Code
          </button>
          
          <div className="h-px bg-zinc-800 my-1 mx-2"></div>
          
          {contextMenu.room.createdBy === currentUser.uid ? (
            <button 
              className="w-full flex items-center px-4 py-2 hover:bg-red-500/10 text-red-400 transition-colors"
              onClick={() => handleDeleteRoom(contextMenu.room.id)}
            >
              <Trash2 className="w-4 h-4 mr-3 text-red-400/80" /> Delete Room
            </button>
          ) : (
            <button 
              className="w-full flex items-center px-4 py-2 hover:bg-orange-500/10 text-orange-400 transition-colors"
              onClick={() => handleLeaveRoom(contextMenu.room.id)}
            >
              <LogOut className="w-4 h-4 mr-3 text-orange-400/80" /> Leave Room
            </button>
          )}
        </div>
      )}
    </div>
  );
}
