import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

export default function ImageLightbox({ imageURL, onClose }) {
  if (!imageURL) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `image-${Date.now()}.png`; // or extract original extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
      // Fallback: open in new tab
      window.open(imageURL, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
            className="p-3 text-white/70 hover:text-white hover:var-bg-primary/10 rounded-full transition-colors"
            title="Download"
          >
            <Download className="w-6 h-6" />
          </button>
          <button 
            onClick={onClose}
            className="p-3 text-white/70 hover:text-white hover:var-bg-primary/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <motion.img 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          src={imageURL} 
          alt="Expanded view" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
