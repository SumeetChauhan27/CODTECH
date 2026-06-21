import { useState, useRef, useEffect } from "react";
import { Send, Smile, X, Check } from "lucide-react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import { useTypingIndicator } from "../../hooks/useTypingIndicator";
import TypingIndicator from "./TypingIndicator";
import { useImageUpload } from "../../hooks/useImageUpload";
import ImageDropzone from "./ImageDropzone";

export default function MessageInput({ roomData, editingMessage, setEditingMessage }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const { currentUser } = useAuth();
  const pickerRef = useRef(null);
  const { typingString, handleTyping, clearTyping } = useTypingIndicator(roomData?.id);
  const { uploadImage, progress, error, isUploading, setError } = useImageUpload();

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text || "");
      setSelectedFile(null);
    }
  }, [editingMessage]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !selectedFile) || !roomData || isUploading || isSending) return;

    const currentName = currentUser.displayName || currentUser.email.split("@")[0];

    try {
      setIsSending(true);
      setShowEmojiPicker(false);
      
      if (editingMessage) {
        await updateDoc(doc(db, "rooms", roomData.id, "messages", editingMessage.id), {
          text: text.trim(),
          editedAt: serverTimestamp()
        });
        setEditingMessage(null);
        setText("");
      } else {
        let uploadedFileURL = null;
        if (selectedFile) {
          uploadedFileURL = await uploadImage(selectedFile, `rooms/${roomData.id}`);
          if (!uploadedFileURL) {
            setIsSending(false);
            return; // Upload failed
          }
        }
        
        const isImage = selectedFile?.type?.startsWith('image/');

        const payload = {
          uid: currentUser.uid,
          displayName: currentName,
          photoURL: currentUser.photoURL || "",
          text: text.trim(),
          imageURL: isImage ? uploadedFileURL : null,
          fileURL: !isImage && selectedFile ? uploadedFileURL : null,
          fileName: selectedFile ? selectedFile.name : null,
          fileType: selectedFile ? selectedFile.type : null,
          fileSize: selectedFile ? selectedFile.size : null,
          createdAt: serverTimestamp(),
          readBy: {
            [currentUser.uid]: {
              displayName: currentName,
              time: Date.now()
            }
          },
          reactions: {}
        };
        
        await addDoc(collection(db, "rooms", roomData.id, "messages"), payload);

        // Update room with lastMessage for notifications and unread badges
        await updateDoc(doc(db, "rooms", roomData.id), {
          lastMessage: {
            text: text.trim() || (isImage ? "📷 Photo" : "📎 Attachment"),
            senderName: currentName,
            senderUid: currentUser.uid,
            createdAt: serverTimestamp()
          }
        });

        setText("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      clearTyping();
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape" && editingMessage) {
      setEditingMessage(null);
      setText("");
    }
  };

  if (!roomData) return null;

  return (
    <div className="relative shrink-0 flex flex-col">
      <TypingIndicator typingString={typingString} />
      
      {showEmojiPicker && (
        <div 
          ref={pickerRef}
          className="absolute bottom-full right-4 mb-2 shadow-2xl rounded-2xl overflow-hidden border var-border-color z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <EmojiPicker 
            onEmojiClick={(e) => {
              setText(prev => prev + e.emoji);
              handleTyping();
            }}
            theme="light"
            skinTonesDisabled
            searchPlaceHolder="Search emoji..."
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {editingMessage && (
        <div className="flex items-center justify-between px-6 py-2 bg-indigo-50 border-t border-indigo-100 relative z-20 shadow-inner">
          <div className="flex items-center gap-3">
            <span className="text-indigo-600 font-bold text-sm tracking-tight">Editing message</span>
            <span className="var-text-secondary text-sm truncate max-w-[200px] sm:max-w-[400px]">{editingMessage.text}</span>
          </div>
          <button 
            onClick={() => {
              setEditingMessage(null);
              setText("");
            }}
            className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSend} 
        className={`px-4 py-3 neo-bg shrink-0 relative z-20 border-t border-white/50`}
      >
        {isUploading && progress > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 rounded-t-xl overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-end gap-3 max-w-4xl mx-auto relative neo-bg neo-shadow-sm rounded-3xl p-2 pl-4">
          <div className="flex-1 flex items-end px-1 py-1">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-xl transition-all ${showEmojiPicker ? 'neo-pressed text-blue-500' : 'var-text-muted hover:text-blue-500 hover:neo-shadow-sm active:scale-95 shrink-0 mb-0.5'}`}
            >
              <Smile className="w-5 h-5" />
            </button>

            {!editingMessage && (
              <ImageDropzone 
                selectedFile={selectedFile}
                onFileSelected={setSelectedFile}
                onClear={() => setSelectedFile(null)}
              />
            )}
            
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              placeholder={editingMessage ? "Edit message..." : "Type a message..."}
              rows={text.split("\n").length > 3 ? 3 : text.split("\n").length}
              className="w-full max-h-32 bg-transparent focus:outline-none resize-none text-[15px] py-2 custom-scrollbar ml-3 var-text-primary placeholder:var-text-muted leading-relaxed"
            />
          </div>
          
          <button
            type="submit"
            disabled={(!text.trim() && !selectedFile) || isUploading || isSending}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0 border-none ${
              (!text.trim() && !selectedFile) || isUploading || isSending 
                ? "bg-zinc-200 var-text-muted cursor-not-allowed" 
                : "neo-blue"
            }`}
          >
            {editingMessage ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
