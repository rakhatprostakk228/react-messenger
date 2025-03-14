import { db } from './firebase';
import { 
  collection, query, where, orderBy, 
  addDoc, serverTimestamp, getDocs,
  doc, getDoc, updateDoc, arrayUnion
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Получить список контактов пользователя
export const getUserContacts = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return [];
  }
  
  const userData = userSnap.data();
  return userData.contacts || [];
};

// Получить список всех пользователей (для поиска)
export const getAllUsers = async (currentUserId) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef);
  const querySnapshot = await getDocs(q);
  
  const users = [];
  querySnapshot.forEach((doc) => {
    if (doc.id !== currentUserId) {
      users.push({ id: doc.id, ...doc.data() });
    }
  });
  
  return users;
};

// Создать или получить чат между двумя пользователями
export const getOrCreateChat = async (userId1, userId2) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId1)
  );
  
  const querySnapshot = await getDocs(q);
  let chatId = null;
  
  querySnapshot.forEach((doc) => {
    const chat = doc.data();
    if (chat.participants.includes(userId2)) {
      chatId = doc.id;
    }
  });
  
  if (!chatId) {
    const newChatRef = await addDoc(chatsRef, {
      participants: [userId1, userId2],
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null
    });
    
    chatId = newChatRef.id;
    
    const user1Ref = doc(db, 'users', userId1);
    const user2Ref = doc(db, 'users', userId2);
    
    await updateDoc(user1Ref, {
      contacts: arrayUnion(userId2)
    });
    
    await updateDoc(user2Ref, {
      contacts: arrayUnion(userId1)
    });
  }
  
  return chatId;
};

// Отправить сообщение
export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const chatRef = doc(db, 'chats', chatId);
  
  const messageId = uuidv4();
  
  await addDoc(messagesRef, {
    id: messageId,
    senderId,
    text,
    createdAt: serverTimestamp(),
    read: false
  });
  
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
    lastMessageSender: senderId
  });
  
  return messageId;
};

export const getChatMessages = async (chatId) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  
  const messages = [];
  querySnapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() });
  });
  
  return messages;
};