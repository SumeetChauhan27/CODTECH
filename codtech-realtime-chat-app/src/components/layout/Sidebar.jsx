import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../services/firebase";
import { MessageSquare, Settings, LogOut, Users, Plus, Hash, Key, Moon, Sun, Trash2, Copy } from "lucide-react";
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
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
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

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        name: newRoomName.trim(),
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
      w-72 neo-bg var-text-primary flex flex-col transition-transform duration-300 ease-in-out border-r border-white/50
    `}>
      <div className="h-[80px] flex items-center px-6 shrink-0 z-10 neo-bg rounded-br-3xl neo-shadow-sm mb-4 mx-4 mt-4">
        <MessageSquare className="w-6 h-6 text-blue-500 mr-3" />
        <h1 className="font-bold text-xl var-text-primary tracking-tight">ChatFlow</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        {/* Actions Header */}
        <div className="flex items-center justify-between mb-6 px-2 mt-2">
          <span className="text-[12px] font-bold var-text-secondary uppercase tracking-widest">Channels</span>
          <div className="flex gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl transition-all neo-bg neo-shadow-sm var-text-secondary hover:text-blue-500 active:scale-95"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-[16px] h-[16px]" /> : <Moon className="w-[16px] h-[16px]" />}
            </button>
            <button 
              onClick={() => { setIsJoining(!isJoining); setIsCreating(false); }}
              className={`p-2 rounded-xl transition-all neo-bg ${isJoining ? 'neo-pressed text-blue-500' : 'neo-shadow-sm var-text-secondary hover:text-blue-500 active:scale-95'}`}
              title="Join a room with code"
            >
              <Key className="w-[16px] h-[16px]" />
            </button>
            <button 
              onClick={() => { setIsCreating(!isCreating); setIsJoining(false); }}
              className={`p-2 rounded-xl transition-all neo-bg ${isCreating ? 'neo-pressed text-blue-500' : 'neo-shadow-sm var-text-secondary hover:text-blue-500 active:scale-95'}`}
              title="Create a new room"
            >
              <Plus className="w-[16px] h-[16px]" />
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
                className="w-full neo-pressed border-none rounded-xl px-4 py-3 text-sm var-text-primary focus:outline-none placeholder:var-text-muted"
              />
              <button type="submit" className="w-full mt-4 neo-blue text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-all active:scale-95">
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
                className="w-full neo-pressed border-none rounded-xl px-4 py-3 text-sm var-text-primary focus:outline-none placeholder:var-text-muted uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
              />
              {joinStatus && (
                <p className={`text-[11px] mt-2 font-bold ${joinStatus.includes('sent') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {joinStatus}
                </p>
              )}
              <button type="submit" className="w-full mt-4 neo-shadow-sm var-text-secondary text-xs font-bold tracking-widest uppercase py-3 rounded-xl hover:var-text-primary transition-all active:scale-95 active:neo-pressed border-none">
                Request to Join
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-4 pt-2">
          {rooms.map(room => {
            const msgTime = room.lastMessage?.createdAt?.toMillis ? room.lastMessage.createdAt.toMillis() : Date.now();
            const readTime = room.lastReadAt?.[currentUser.uid]?.toMillis ? room.lastReadAt[currentUser.uid].toMillis() : 0;
            const hasUnread = currentRoomId !== room.id && room.lastMessage && msgTime > readTime;
            const isActive = currentRoomId === room.id;
            
            return (
              <button
                key={room.id}
                onClick={() => {
                  navigate(`/chat/${room.id}`);
                  setIsMobileOpen(false);
                }}
                onContextMenu={(e) => handleContextMenu(e, room)}
                className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all text-[15px] font-bold group relative border-none ${
                  isActive 
                    ? "neo-pressed var-text-primary" 
                    : "neo-shadow-sm var-text-secondary hover:var-text-primary"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0 shadow-inner overflow-hidden ${isActive ? 'bg-blue-50' : 'neo-bg'}`}>
                  {/* Using a placeholder avatar for the room based on its name */}
                  <img src={`https://ui-avatars.com/api/?name=${room.name}&background=random&bold=true`} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <span className="truncate tracking-tight flex-1 text-left">{room.name}</span>
                {hasUnread && (
                  <div className="ml-2 neo-red-badge px-2 py-0.5 rounded-full text-[11px] font-black flex items-center justify-center shadow-md border-2 border-white/50">
                    1
                  </div>
                )}
              </button>
            );
          })}
          {rooms.length === 0 && !isCreating && !isJoining && (
            <div className="text-xs var-text-secondary px-4 mt-8 text-center font-bold neo-pressed py-6 rounded-2xl">
              You are not in any rooms.<br/><br/>Join or create one!
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
            <Copy className="w-4 h-4 mr-3 var-text-muted" /> Copy Invite Code
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
