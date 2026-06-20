import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput({ roomData }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentUser } = useAuth();
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || !roomData) return;

    const currentName = currentUser.displayName || currentUser.email.split("@")[0];

    try {
      setIsSending(true);
      setShowEmojiPicker(false);
      await addDoc(collection(db, "rooms", roomData.id, "messages"), {
        uid: currentUser.uid,
        displayName: currentName,
        photoURL: currentUser.photoURL || "",
        text: text.trim(),
        createdAt: serverTimestamp(),
        // New Schema: object mapping uid to details and timestamp
        readBy: {
          [currentUser.uid]: {
            displayName: currentName,
            time: Date.now()
          }
        },
        reactions: {}
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
  };

  if (!roomData) return null;

  return (
    <div className="relative shrink-0">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-full left-4 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden border border-zinc-100">
          <EmojiPicker 
            onEmojiClick={onEmojiClick}
            theme="light"
            skinTonesDisabled
            searchDisabled
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <form 
        onSubmit={handleSend} 
        className="px-4 py-3 bg-white/80 backdrop-blur-xl border-t border-zinc-200/60 flex items-end gap-3 shrink-0"
      >
        <div className="flex-1 bg-zinc-100/80 rounded-2xl flex items-end px-4 py-2 border border-zinc-200/50 transition-colors focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors shrink-0 mb-0.5 -ml-1"
          >
            <Smile className="w-6 h-6" />
          </button>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={text.split("\n").length > 3 ? 3 : text.split("\n").length}
            className="w-full max-h-32 bg-transparent focus:outline-none resize-none text-[15px] py-1.5 scrollbar-thin ml-2 text-zinc-800 placeholder:text-zinc-400"
          />
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-md shadow-blue-600/20"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
