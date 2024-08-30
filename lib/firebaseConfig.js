// lib/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCr4xnwB7nPyi5DMcFLYzd2BkJiSM4gBdE",
    authDomain: "next-6fbd5.firebaseapp.com",
    projectId: "next-6fbd5",
    storageBucket: "next-6fbd5.appspot.com",
    messagingSenderId: "22865523743",
    appId: "1:22865523743:web:76e2aeac0eb749d959112a"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
