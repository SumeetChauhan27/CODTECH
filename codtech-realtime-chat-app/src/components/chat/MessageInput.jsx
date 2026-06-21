import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import { useTypingIndicator } from "../../hooks/useTypingIndicator";
import TypingIndicator from "./TypingIndicator";
import { useImageUpload } from "../../hooks/useImageUpload";
import ImageDropzone from "./ImageDropzone";

export default function MessageInput({ roomData }) {
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

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !selectedFile) || !roomData || isUploading || isSending) return;

    const currentName = currentUser.displayName || currentUser.email.split("@")[0];

    try {
      setIsSending(true);
      setShowEmojiPicker(false);
      
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
      setText("");
      setSelectedFile(null);
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
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
  };

  if (!roomData) return null;

  return (
    <div className="relative shrink-0">
      <TypingIndicator typingString={typingString} />
      
      {showEmojiPicker && (
        <div 
          ref={pickerRef}
          className="absolute bottom-full right-4 mb-2 shadow-2xl rounded-2xl overflow-hidden border border-zinc-100 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
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

      <form 
        onSubmit={handleSend} 
        className="px-4 py-3 bg-white/80 backdrop-blur-xl border-t border-zinc-200/60 shrink-0 relative z-20"
      >
        {isUploading && progress > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 rounded-t-xl overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1 bg-zinc-100/80 rounded-2xl flex items-end px-4 py-2 border border-zinc-200/50 transition-colors focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors shrink-0 mb-0.5 -ml-1"
            >
              <Smile className="w-6 h-6" />
            </button>

            <ImageDropzone 
              selectedFile={selectedFile}
              onFileSelected={setSelectedFile}
              onClear={() => setSelectedFile(null)}
            />
            
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={text.split("\n").length > 3 ? 3 : text.split("\n").length}
              className="w-full max-h-32 bg-transparent focus:outline-none resize-none text-[15px] py-1.5 scrollbar-thin ml-2 text-zinc-800 placeholder:text-zinc-400"
            />
          </div>
          
          <button
            type="submit"
            disabled={(!text.trim() && !selectedFile) || isUploading || isSending}
            className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-md shadow-blue-600/20"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
