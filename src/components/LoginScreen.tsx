import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const ChatIcon: React.FC = () => (
    <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C11.5394 22 11.0873 21.9818 10.6453 21.9472C10.5938 21.9423 10.5422 21.9374 10.4905 21.9324C9.18204 21.7958 8.0772 21.1183 7.21884 20.0824C7.03157 19.8335 6.78854 19.6276 6.51174 19.4752L3.27299 17.653C2.52849 17.2291 2 16.4555 2 15.6011V12Z" />
    </svg>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center flex flex-col items-center">
      <ChatIcon />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Sohbet Odasına Hoş Geldiniz</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6">Sohbete başlamak için bir kullanıcı adı girin.</p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kullanıcı Adınız"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            aria-label="Kullanıcı Adınız"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:bg-blue-300"
          disabled={!name.trim()}
        >
          Sohbete Katıl
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
