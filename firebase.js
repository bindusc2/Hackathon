import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyA4X-WSRua1IqrLzvMbZ9igD534WRV-1dU',
  authDomain: 'ai-detection-81fe8.firebaseapp.com',
  projectId: 'ai-detection-81fe8',
  storageBucket: 'ai-detection-81fe8.firebasestorage.app',
  messagingSenderId: '201262224464',
  appId: '1:201262224464:web:1d0ca0393484cd0b4ced55',
  measurementId: 'G-RZ0FJTT3V4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };