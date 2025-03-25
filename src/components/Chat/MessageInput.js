import React, { useState } from 'react';
import { sendMessage } from '../../services/chatService';

const MessageInput = ({ chatId, currentUserId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !chatId || !currentUserId) return;
    
    try {
      setSending(true);
      await sendMessage(chatId, currentUserId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      alert('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={sending || !chatId}
      />
      <button 
        type="submit" 
        disabled={sending || !message.trim() || !chatId}
      >
        Отправить
      </button>
    </form>
  );
};

export default MessageInput;