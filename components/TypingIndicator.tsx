import React from 'react';

interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  // Alanı ayırarak gösterge göründüğünde veya kaybolduğunda arayüzün kaymasını önle
  if (typingUsers.length === 0) {
    return <div className="h-6" />;
  }

  let text = '';
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} yazıyor`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} ve ${typingUsers[1]} yazıyor`;
  } else {
    text = `${typingUsers.slice(0, 2).join(', ')} ve diğerleri yazıyor`;
  }

  return (
    <div className="h-6 text-sm text-gray-500 dark:text-gray-400">
      {text}
      <span className="typing-indicator inline-block ml-1">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  );
};

export default TypingIndicator;
