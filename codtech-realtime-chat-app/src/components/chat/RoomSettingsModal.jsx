import { useState, useEffect } from "react";
import { X, Settings, Shield, UserX, Crown, Save, ShieldAlert, Key } from "lucide-react";
import { doc, updateDoc, getDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function RoomSettingsModal({ roomData, onClose }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [roomName, setRoomName] = useState(roomData?.name || "");
  const [membersInfo, setMembersInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isCreator = roomData?.createdBy === currentUser.uid;
  const isAdmin = isCreator || roomData?.admins?.includes(currentUser.uid);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const promises = roomData.members.map(async (uid) => {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            return { uid, ...snap.data() };
          }
          return { uid, displayName: "Unknown User" };
        });
        const users = await Promise.all(promises);
        setMembersInfo(users);
      } catch (err) {
        console.error("Error fetching members", err);
      } finally {
        setLoading(false);
      }
    };
    if (roomData?.members?.length > 0) {
      fetchMembers();
    }
  }, [roomData?.members]);

  const handleUpdateName = async () => {
    if (!roomName.trim() || roomName.trim() === roomData.name) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "rooms", roomData.id), {
        name: roomName.trim()
      });
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleKick = async (uid) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await updateDoc(doc(db, "rooms", roomData.id), {
          members: arrayRemove(uid),
          admins: arrayRemove(uid) // in case they were an admin
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleAdmin = async (uid, currentIsAdmin) => {
    try {
      if (currentIsAdmin) {
        await updateDoc(doc(db, "rooms", roomData.id), {
          admins: arrayRemove(uid)
        });
      } else {
        await updateDoc(doc(db, "rooms", roomData.id), {
          admins: arrayUnion(uid)
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferOwnership = async (uid) => {
    if (window.confirm("Are you sure you want to transfer ownership? You will become a regular admin.")) {
      try {
        await updateDoc(doc(db, "rooms", roomData.id), {
          createdBy: uid,
          admins: arrayUnion(currentUser.uid)
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="var-bg-primary rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="px-6 py-4 border-b var-border-color flex items-center justify-between shrink-0 var-bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold var-text-primary tracking-tight">Room Settings</h2>
              <p className="text-xs var-text-secondary font-medium">#{roomData.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 var-text-muted hover:var-text-secondary hover:var-bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b var-border-color shrink-0 px-4">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "general" ? "border-indigo-500 text-indigo-600" : "border-transparent var-text-secondary hover:var-text-primary"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "members" ? "border-indigo-500 text-indigo-600" : "border-transparent var-text-secondary hover:var-text-primary"
            }`}
          >
            Members ({roomData?.members?.length || 0})
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Room Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    disabled={!isAdmin}
                    className="flex-1 var-bg-secondary border var-border-color rounded-xl px-4 py-2.5 text-sm var-text-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-60"
                  />
                  {isAdmin && (
                    <button
                      onClick={handleUpdateName}
                      disabled={saving || roomName.trim() === roomData.name}
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Invite Code</label>
                <div className="flex items-center gap-3 var-bg-secondary border var-border-color rounded-xl px-4 py-3">
                  <Key className="w-5 h-5 text-indigo-500" />
                  <span className="text-lg font-mono font-bold tracking-widest var-text-primary">{roomData.inviteCode}</span>
                </div>
                <p className="text-xs var-text-secondary mt-2 font-medium">Share this 10-digit code with others so they can request to join.</p>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-sm var-text-secondary font-medium">Loading members...</div>
              ) : (
                membersInfo.map(member => {
                  const isMemCreator = member.uid === roomData.createdBy;
                  const isMemAdmin = roomData.admins?.includes(member.uid);
                  const isMe = member.uid === currentUser.uid;

                  return (
                    <div key={member.uid} className="flex items-center justify-between p-3 rounded-xl border var-border-color hover:var-border-color var-bg-primary hover:var-bg-secondary transition-colors">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.displayName)}`} 
                          alt={member.displayName}
                          className="w-10 h-10 rounded-full border var-border-color"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold var-text-primary text-sm">
                              {member.displayName}
                              {isMe && <span className="ml-1 var-text-muted font-normal">(You)</span>}
                            </span>
                            {isMemCreator && <Crown className="w-3.5 h-3.5 text-amber-500" title="Creator" />}
                            {!isMemCreator && isMemAdmin && <Shield className="w-3.5 h-3.5 text-indigo-500" title="Admin" />}
                          </div>
                          <span className="text-xs var-text-secondary">
                            {isMemCreator ? "Room Creator" : isMemAdmin ? "Admin" : "Member"}
                          </span>
                        </div>
                      </div>

                      {isAdmin && !isMe && !isMemCreator && (
                        <div className="flex items-center gap-2">
                          {isCreator && (
                            <>
                              <button
                                onClick={() => handleToggleAdmin(member.uid, isMemAdmin)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isMemAdmin 
                                    ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" 
                                    : "var-text-muted hover:text-indigo-600 hover:var-bg-secondary"
                                }`}
                                title={isMemAdmin ? "Remove Admin" : "Make Admin"}
                              >
                                <ShieldAlert className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleTransferOwnership(member.uid)}
                                className="p-2 var-text-muted hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Transfer Ownership"
                              >
                                <Crown className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {(!isMemAdmin || isCreator) && (
                            <button
                              onClick={() => handleKick(member.uid)}
                              className="p-2 var-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Kick Member"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
