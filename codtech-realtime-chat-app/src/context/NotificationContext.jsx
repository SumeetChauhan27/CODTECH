import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, "notifications", currentUser.uid, "items"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, [currentUser]);

  const markAsRead = async (notifId) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "notifications", currentUser.uid, "items", notifId), {
        read: true
      });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser || notifications.length === 0) return;
    const batch = writeBatch(db);
    const unreadNotifs = notifications.filter(n => !n.read);
    
    unreadNotifs.forEach(n => {
      const ref = doc(db, "notifications", currentUser.uid, "items", n.id);
      batch.update(ref, { read: true });
    });

    try {
      await batch.commit();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
