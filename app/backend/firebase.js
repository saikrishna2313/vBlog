
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBfiQN4-_iW1B7BU3wU9g-2Hy4LJEXdPZE",
  authDomain: "vblog-219cb.firebaseapp.com",
  projectId: "vblog-219cb",
  storageBucket: "vblog-219cb.appspot.com",
  messagingSenderId: "645470996131",
  appId: "1:645470996131:web:ee319e7581d7a88faba116"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage()
