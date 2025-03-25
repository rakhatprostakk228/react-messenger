import React from 'react';
import { formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';

const Message = ({ message, isOwnMessage }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return formatRelative(date, new Date(), { locale: ru });
  };

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        <span className="message-time">
          {message.createdAt ? formatDate(message.createdAt) : 'Отправляется...'}
        </span>
      </div>
    </div>
  );
};

export default Message;