
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import ChatWindow from './components/ChatWindow';
import type { Message, User } from './types';

// Firebase v9+ modüler fonksiyonlarını içe aktar
// FIX: The original code was using the modular Firebase v9 SDK, but the error "Module '"firebase/app"' has no exported member 'initializeApp'" suggests a version mismatch or environment issue.
// Switched to the v9 compat library to provide a v8-style API surface which is more robust against such issues.
// HATA DÜZELTMESİ: 'default' dışa aktarma hatasını çözmek için 'import firebase from' ifadesi 'import * as firebase from' olarak değiştirildi.
// FIX: The `import * as firebase` syntax is incorrect for the Firebase v8 compatibility API. It should be a default import to correctly load the Firebase services. This resolves all subsequent type errors.
// FIX: Corrected the import to use a named import `{ firebase }` which matches the module structure provided by the CDN, resolving the "no default export" runtime error and the subsequent blank screen.
// FIX: Corrected the Firebase import to use a default import as required by the v9 compatibility library.
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';


// --- ÖNEMLİ KURULUM ADIMI ---
// Bu uygulamanın çalışması için kendi Firebase projenizi oluşturmanız gerekmektedir.
// 1. console.firebase.google.com adresine gidin ve yeni bir proje oluşturun.
// 2. Proje ayarlarına gidin ve yeni bir "Web Uygulaması" ekleyin.
// 3. Size verilen `firebaseConfig` nesnesini kopyalayıp aşağıdaki sahte değerlerin yerine yapıştırın.
// 4. Sol menüden "Build" > "Authentication"a gidin, "Sign-in method" sekmesini seçin
//    ve "Anonymous" (Anonim) sağlayıcısını etkinleştirin.
// 5. Sol menüden "Build" > "Realtime Database"e gidin.
// 6. Veritabanı oluşturun ve "Rules" (Kurallar) sekmesine geçip kuralları aşağıdaki gibi güncelleyin:
//    {
//      "rules": {
//        ".read": "auth != null",
//        ".write": "auth != null"
//      }
//    }
//
// --- ÖNEMLİ: VERİTABANI BÖLGESİ KONTROLÜ ---
// 'Bağlantı zaman aşımına uğradı' hatası alıyorsanız, bunun en yaygın sebebi 
// `databaseURL`'nin projenizin bölgesiyle eşleşmemesidir.
// 1. Firebase projenizde "Build" > "Realtime Database" bölümüne gidin.
// 2. Veri bağlantıları sekmesinin üst kısmında veritabanı URL'nizi göreceksiniz.
//    (Örn: https://proje-adi-default-rtdb.europe-west1.firebasedatabase.app)
// 3. Bu URL'yi kopyalayıp aşağıdaki `databaseURL` değeriyle değiştirin.
//
// Firebase yapılandırmanız buraya eklendi.
// databaseURL, projenizin kimliğine göre otomatik olarak eklendi.
const firebaseConfig = {
  apiKey: "AIzaSyBLpgu8LZdb7TqS1XYakSxk-EwJlZmwWeU",
  authDomain: "emir-fc090.firebaseapp.com",
  // HATA DÜZELTMESİ: 'Bağlantı zaman aşımına uğradı' hatasını çözmek için veritabanı URL'si
  // kullanıcının belirttiği Belçika (europe-west1) bölgesine göre güncellendi.
  databaseURL: "https://emir-fc090-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "emir-fc090",
  storageBucket: "emir-fc090.appspot.com",
  messagingSenderId: "575922519123",
  appId: "1:575922519123:web:03ab07cc8ab82cd40fdaa6",
  measurementId: "G-3RVEPMHSMZ"
};

// Çökmeden önce yapılandırmanın tamamlanıp tamamlanmadığını kontrol et
const isConfigured = firebaseConfig.apiKey && 
                     !firebaseConfig.apiKey.includes("SİZİN_API_KEYİNİZ") && // Placeholder check
                     firebaseConfig.projectId &&
                     !firebaseConfig.projectId.includes("LÜTFEN_KENDİ");

// Firebase'i sadece yapılandırma geçerliyse başlat
// FIX: Switched to Firebase v9 compat library for initialization.
// This avoids module resolution issues with initializeApp and provides a stable v8 API.
let messagesRef: firebase.database.Reference | undefined;
let typingRef: firebase.database.Reference | undefined;
if (isConfigured) {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    messagesRef = firebase.database().ref('messages');
    typingRef = firebase.database().ref('typing');
  } catch (error) {
    console.error("Firebase başlatma hatası:", error);
  }
}

const ConfigurationNeededScreen: React.FC = () => (
  <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center flex flex-col items-center">
      <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Firebase Yapılandırması Gerekli</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6">
        Uygulamanın çalışabilmesi için Firebase proje bilgilerinizi girmeniz gerekmektedir.
      </p>
      <div className="text-left w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Lütfen <strong>App.tsx</strong> dosyasını açın ve <code>firebaseConfig</code> nesnesini kendi Firebase proje bilgilerinizle güncelleyin.
        </p>
        <pre className="mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-md overflow-x-auto text-xs">
          <code>
{`const firebaseConfig = {
  apiKey: "SİZİN_API_KEYİNİZ",
  authDomain: "SİZİN_AUTHDOMAINİNİZ",
  databaseURL: "SİZİN_DATABASEURLİNİZ",
  projectId: "SİZİN_PROJECTIDNİZ",
  // ...diğer alanlar
};`}
          </code>
        </pre>
      </div>
    </div>
  </div>
);

type ConnectionStatus = 'disconnected' | 'connecting' | 'subscribed' | 'error';
type AuthStatus = 'initializing' | 'authenticated' | 'error';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('initializing');

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false });
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs].slice(0, 100));
  }, []);
  
  useEffect(() => {
    if (!isConfigured) return;

    const signIn = async () => {
      try {
        addLog("🔐 Firebase ile anonim kimlik doğrulanıyor...");
        const userCredential = await firebase.auth().signInAnonymously();
        if (userCredential.user) {
          addLog(`✅ Anonim olarak başarıyla oturum açıldı. UID: ${userCredential.user.uid}`);
          setAuthStatus('authenticated');
        } else {
          throw new Error("Firebase kullanıcı nesnesi döndürmedi.");
        }
      } catch (error: any) {
        console.error("Firebase anonim giriş hatası:", error);
        let errorMessage = `Kimlik doğrulama başarısız: ${error.message}.`;
        if (error.code === 'auth/operation-not-allowed') {
            errorMessage += " Lütfen Firebase projenizde 'Anonymous' (Anonim) oturum açma yöntemini etkinleştirdiğinizden emin olun.";
        }
        setError(errorMessage);
        setAuthStatus('error');
        addLog(`💥 Kimlik doğrulama hatası: ${errorMessage}`);
      }
    };
    
    signIn();
  }, [addLog]);

  const handleNewMessage = useCallback((snapshot: firebase.database.DataSnapshot) => {
    const messageData = snapshot.val();
    if (!messageData) return;
    const newMessage: Message = { ...messageData, id: snapshot.key as string };

    setConnectionStatus(prevStatus => {
        if (prevStatus !== 'subscribed') {
            addLog("✅ Firebase Gerçek Zamanlı Veritabanına başarıyla bağlanıldı.");
        }
        return 'subscribed';
    });

    setMessages(prevMessages => {
        if (prevMessages.some(msg => msg.id === newMessage.id)) {
            return prevMessages;
        }
        return [...prevMessages, newMessage].sort((a, b) => a.timestamp - b.timestamp);
    });
    addLog(`📩 Yeni mesaj alındı: "${messageData.text}"`);
  }, [addLog]);

  const handleError = useCallback((error: Error) => {
      console.error("Firebase Hatası:", error);
      let errorMessage = `Firebase bağlantı hatası: ${error.message}.`;
      if (error.message.toLowerCase().includes('permission_denied')) {
          errorMessage = "Veritabanı erişim izni reddedildi. Firebase kurallarınızın ('auth != null') doğru ayarlandığından ve anonim kimlik doğrulamanın etkin olduğundan emin olun.";
      } else if (error.message.includes("service is unavailable")) {
          errorMessage = "Firebase hizmeti şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
      } else if (error.message.includes("Bağlantı zaman aşımına uğradı")) {
          errorMessage = `Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı ve Firebase veritabanı BÖLGENİZİ kontrol edin. Uygulama, "${firebaseConfig.databaseURL}" adresine bağlanmaya çalıştı. Doğru URL'yi Firebase konsolunuzdaki Realtime Database bölümünden kopyalayın.`;
      }
      setError(errorMessage);
      setConnectionStatus('error');
      addLog(`❌ Hata: ${errorMessage}`);
  }, [addLog]);
  
  useEffect(() => {
    if (!user) {
      return;
    }

    setMessages([]);
    setError(null);
    setLogs([]);
    addLog("🔥 Firebase'e bağlanılıyor ve mesajlar dinleniyor...");
    setConnectionStatus('connecting');

    messagesRef!.on('child_added', handleNewMessage, handleError);
    
    messagesRef!.once('value', (snapshot) => {
      if (!snapshot.exists()) {
        addLog("ℹ️ Henüz hiç mesaj yok. İlk mesajı siz gönderin!");
        setConnectionStatus('subscribed');
        addLog("✅ Firebase Gerçek Zamanlı Veritabanına başarıyla bağlanıldı.");
      }
    }).catch(handleError);

    const typingListener = typingRef!.on('value', (snapshot) => {
        const typingData = snapshot.val() || {};
        const now = Date.now();
        const TYPING_TIMEOUT = 5000; // 5 saniye

        const currentTypingUsers = Object.entries(typingData)
          .filter(([userId, data]: [string, any]) => 
            userId !== user.id && now - data.timestamp < TYPING_TIMEOUT
          )
          .map(([, data]: [string, any]) => data.name);

        setTypingUsers(currentTypingUsers);
    });

    return () => {
      addLog("🔥 Firebase dinleyicileri kaldırılıyor.");
      messagesRef?.off('child_added', handleNewMessage);
      typingRef?.off('value', typingListener);
      typingRef?.child(user.id).remove();
    };
  }, [user, addLog, handleNewMessage, handleError]);

  const handleLogin = (name: string) => {
    const firebaseUser = firebase.auth().currentUser;
    if (name.trim() && firebaseUser) {
      const newUser: User = { 
        name: name.trim(), 
        id: firebaseUser.uid
      };
      setUser(newUser);
    }
  };
  
  const handleTypingChange = useCallback((isTyping: boolean) => {
    if (!user || !typingRef) return;
    const firebaseUser = firebase.auth().currentUser;
    if (!firebaseUser) return;

    if (isTyping) {
        typingRef.child(firebaseUser.uid).set({
            name: user.name,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    } else {
        typingRef.child(firebaseUser.uid).remove();
    }
  }, [user]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!user || connectionStatus !== 'subscribed') {
      const errorMsg = "Mesaj gönderilemiyor. Sunucuya bağlantı kurulamadı.";
      setError(errorMsg);
      addLog(`❌ Gönderim engellendi: Bağlantı durumu: ${connectionStatus}`);
      return;
    }
    
    const newMessageData = {
      text,
      user,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };
    
    addLog(`📤 Mesaj gönderiliyor: "${text}"`);
    try {
        await messagesRef!.push(newMessageData);
        handleTypingChange(false);
        setError(null);
    } catch (e: any) {
        const errorMsg = `Mesaj gönderilemedi: ${e.message}`;
        setError(errorMsg);
        addLog(`💥 Kritik gönderim hatası: ${e.message}`);
        console.error(e);
    }
  }, [user, connectionStatus, addLog, handleTypingChange]);

  if (!isConfigured) {
    return <ConfigurationNeededScreen />;
  }
  
  if (authStatus === 'initializing') {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Bağlanılıyor...</h1>
                <p className="text-gray-600 dark:text-gray-300">Güvenli sohbet oturumu oluşturuluyor.</p>
            </div>
        </div>
    );
  }

  if (authStatus === 'error') {
     return (
        <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center flex flex-col items-center">
                 <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-4">Kimlik Doğrulama Hatası</h1>
                 <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6 break-words">{error}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Firebase projenizin 'Authentication' bölümünde 'Anonymous' (Anonim) oturum açma yöntemini etkinleştirdiğinizden emin olun.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 w-full h-screen flex items-center justify-center p-4">
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <ChatWindow
          user={user}
          messages={messages}
          onSendMessage={handleSendMessage}
          error={error}
          connectionStatus={connectionStatus}
          logs={logs}
          onTypingChange={handleTypingChange}
          typingUsers={typingUsers}
        />
      )}
    </div>
  );
};

export default App;
