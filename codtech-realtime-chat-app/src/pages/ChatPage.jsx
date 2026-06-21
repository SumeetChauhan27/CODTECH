import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import { LogOut, Menu, Key, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { db, rtdb } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import ProfileEditModal from "../components/profile/ProfileEditModal";

export default function ChatPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [myPresence, setMyPresence] = useState("offline");
  
  const { currentUser, logout } = useAuth();
  const { roomId: currentRoomId } = useParams();

  useEffect(() => {
    if (!currentUser?.uid) return;
    const presenceRef = ref(rtdb, `/status/${currentUser.uid}`);
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        setMyPresence(snapshot.val().state);
      } else {
        setMyPresence("offline");
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentRoomId) {
      setRoomData(null);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "rooms", currentRoomId), (docSnap) => {
      if (docSnap.exists()) {
        setRoomData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setRoomData(null);
      }
    });
    return unsubscribe;
  }, [currentRoomId]);

  const handleCopyCode = () => {
    if (!roomData?.inviteCode) return;
    navigator.clipboard.writeText(roomData.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = async (requestUser) => {
    try {
      await updateDoc(doc(db, "rooms", currentRoomId), {
        pendingRequests: arrayRemove(requestUser),
        members: arrayUnion(requestUser.uid)
      });
    } catch (err) {
      console.error("Error approving user", err);
    }
  };

  const handleReject = async (requestUser) => {
    try {
      await updateDoc(doc(db, "rooms", currentRoomId), {
        pendingRequests: arrayRemove(requestUser)
      });
    } catch (err) {
      console.error("Error rejecting user", err);
    }
  };

  const isMember = roomData?.members?.includes(currentUser.uid);
  const isCreator = roomData?.createdBy === currentUser.uid;
  const hasPendingRequest = roomData?.pendingRequests?.some(r => r.uid === currentUser.uid);

  return (
    <div className="flex h-screen max-h-[100dvh] bg-zinc-50 overflow-hidden relative">
      <Sidebar 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white relative z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]">
        {/* Navbar */}
        <div className="h-[72px] bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 border-b border-zinc-200/60 z-20 transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-inner flex items-center justify-center transform transition-transform hover:scale-105">
                {roomData ? (
                  <span className="text-white font-bold text-lg">#</span>
                ) : (
                  <span className="text-blue-100">?</span>
                )}
              </div>
              <div>
                <h2 className="font-bold text-[17px] text-zinc-900 leading-tight tracking-tight">
                  {roomData ? roomData.name : "Select a Chat"}
                </h2>
                <span className="text-xs text-zinc-500 font-medium">
                  {isCreator && roomData?.pendingRequests?.length > 0 ? (
                    <button onClick={() => setShowRequestsModal(true)} className="text-orange-500 hover:text-orange-600 transition-colors">
                      {roomData.pendingRequests.length} pending request(s)
                    </button>
                  ) : (
                    roomData?.members ? `${roomData.members.length} member(s)` : ""
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {roomData?.inviteCode && isMember && (
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 mr-3 px-4 py-2 bg-zinc-100/80 text-zinc-700 hover:bg-zinc-200/80 rounded-xl transition-all text-sm font-semibold active:scale-95"
                title="Copy 10-digit Invite Code"
              >
                <Key className="w-4 h-4 text-zinc-500" />
                <span className="hidden sm:inline">
                  {copied ? "Copied!" : `Code: ${roomData.inviteCode}`}
                </span>
              </button>
            )}

            <div className="w-px h-8 bg-zinc-200 mx-2 hidden sm:block"></div>

            <button
              onClick={() => setShowProfileEdit(true)}
              className="hidden sm:flex flex-col items-end mr-1 px-2 py-1 hover:bg-zinc-100 rounded-lg transition-colors text-right"
            >
              <span className="text-sm font-bold text-zinc-800 leading-tight">
                {currentUser?.displayName || currentUser?.email.split('@')[0]}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  myPresence === "online" ? "bg-emerald-500" : 
                  myPresence === "away" ? "bg-amber-500" : "bg-zinc-500"
                }`} />
                <span className="text-[11px] font-medium text-zinc-500 group-hover:text-indigo-500 transition-colors">
                  {myPresence === "online" ? "Online" : myPresence === "away" ? "Idle" : "Offline"} · Edit Profile
                </span>
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group active:scale-95"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showProfileEdit && (
            <ProfileEditModal onClose={() => setShowProfileEdit(false)} />
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-zinc-50">
          {/* Overlay to close sidebar on mobile */}
          {isMobileOpen && (
            <div 
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
              onClick={() => setIsMobileOpen(false)}
            />
          )}

          {!currentRoomId ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-zinc-400 font-medium bg-white px-6 py-3 rounded-2xl shadow-sm border border-zinc-100">Select a room from the sidebar</p>
            </div>
          ) : !roomData ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isMember ? (
            <>
              <MessageList roomData={roomData} />
              <MessageInput roomData={roomData} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-50">
              <div className="max-w-sm w-full bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">Private Room</h3>
                
                {hasPendingRequest ? (
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Your request to join <strong className="text-zinc-800">{roomData.name}</strong> has been sent. Please wait for the room creator to approve you.
                  </p>
                ) : (
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    You need to use the 10-digit invite code in the sidebar to request access to this room.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Requests Modal for Creator */}
      <AnimatePresence>
        {showRequestsModal && isCreator && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-zinc-900/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-zinc-100"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white">
                <h3 className="font-bold text-lg text-zinc-900 tracking-tight">Join Requests</h3>
                <button onClick={() => setShowRequestsModal(false)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-3 max-h-[60vh] overflow-y-auto scrollbar-thin">
                {roomData.pendingRequests?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-4xl mb-3">👻</div>
                    <p className="text-zinc-500 font-medium">No pending requests.</p>
                  </div>
                ) : (
                  roomData.pendingRequests?.map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-3 mb-2 hover:bg-zinc-50 rounded-2xl transition-colors border border-transparent hover:border-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">
                            {req.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 text-[15px]">{req.displayName}</p>
                          <p className="text-xs text-zinc-500 font-medium">ID: {req.uid.substring(0,8)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleReject(req)}
                          className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(req)}
                          className="px-4 py-2 text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-colors active:scale-95 shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
