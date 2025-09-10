import React from 'react';
import type { Message, User } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser }) => {
  const isCurrentUser = message.user.id === currentUser.id;

  const bubbleClasses = isCurrentUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none';

  const containerClasses = isCurrentUser ? 'justify-end' : 'justify-start';
  const senderName = isCurrentUser ? 'Siz' : message.user.name;

  return (
    <div className={`flex items-end gap-2 ${containerClasses}`}>
      {!isCurrentUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full text-gray-800 dark:text-gray-200 font-bold text-sm flex items-center justify-center" title={message.user.name}>
          {message.user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className={`flex flex-col space-y-1 max-w-xs md:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {!isCurrentUser && <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">{senderName}</span>}
        <div className={`px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}>
          <p className="text-base break-words whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
       {isCurrentUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full text-white font-bold text-sm flex items-center justify-center" title={currentUser.name}>
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;