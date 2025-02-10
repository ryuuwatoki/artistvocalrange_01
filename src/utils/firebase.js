import { initializeApp } from 'firebase/app'; // 使用命名導入
import { getAuth } from 'firebase/auth'; // 如果需要使用 Firebase 認證，單獨導入
import { getFirestore } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const firebaseConfig = {

  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID



};

const app = initializeApp(firebaseConfig); // 初始化 Firebase 應用
const auth = getAuth(app); // 獲取 Firebase 認證
const db = getFirestore(app);

export { db,auth }; // 將 auth 導出，讓其他模塊可以使用
// export default firebase;