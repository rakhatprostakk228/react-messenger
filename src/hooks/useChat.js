import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { 
  collection, query, where, orderBy, 
  onSnapshot, doc, getDoc 
} from 'firebase/firestore';

export function useChat(chatId, userId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  
  useEffect(() => {
    if (!chatId) return;
    
    const fetchChatInfo = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);
        
        if (chatSnap.exists()) {
          const data = chatSnap.data();
          
          const otherUserId = data.participants.find(id => id !== userId);
          const userRef = doc(db, 'users', otherUserId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setChatInfo({
              ...data,
              otherUser: {
                id: otherUserId,
                ...userSnap.data()
              }
            });
          }
        }
      } catch (err) {
        setError('Ошибка при загрузке информации о чате');
        console.error(err);
      }
    };
    
    fetchChatInfo();
  }, [chatId, userId]);
  
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          newMessages.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate()
          });
        }
      });
      
      setMessages(newMessages);
      setLoading(false);
    }, (err) => {
      setError('Ошибка при загрузке сообщений');
      setLoading(false);
      console.error(err);
    });
    
    return unsubscribe;
  }, [chatId]);
  
  return { messages, loading, error, chatInfo };
}