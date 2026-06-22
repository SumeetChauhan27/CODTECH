import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, MessageSquare } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 neo-bg var-text-secondary hover:text-blue-500 neo-shadow-sm active:neo-pressed rounded-xl transition-all border-none"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 neo-bg neo-shadow border var-border-color rounded-2xl overflow-hidden z-50"
          >
            <div className="p-3 border-b var-border-color flex items-center justify-between">
              <h3 className="font-bold var-text-primary text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm var-text-muted">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 border-b var-border-color last:border-0 hover:bg-black/5 cursor-pointer transition-colors flex gap-3 ${!notif.read ? 'bg-blue-500/5' : ''}`}
                  >
                    <div className="mt-0.5">
                      {notif.type === 'message' ? (
                        <MessageSquare className={`w-4 h-4 ${!notif.read ? 'text-blue-500' : 'var-text-secondary'}`} />
                      ) : (
                        <Bell className={`w-4 h-4 ${!notif.read ? 'text-blue-500' : 'var-text-secondary'}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm var-text-primary">
                        <span className="font-bold">{notif.fromDisplayName}</span> {notif.text}
                      </p>
                      {notif.roomName && (
                        <p className="text-xs var-text-muted mt-0.5">in #{notif.roomName}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
