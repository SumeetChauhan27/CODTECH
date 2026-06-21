import { motion, AnimatePresence } from 'framer-motion';

export default function TypingIndicator({ typingString }) {
  return (
    <AnimatePresence>
      {typingString && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-7 left-2 flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-zinc-100 shadow-sm z-10"
        >
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs font-medium text-zinc-500">{typingString}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
