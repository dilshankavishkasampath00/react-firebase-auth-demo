// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBppPuYm9K9QUnc1IX7JqwhXSx2U9dIpHE",
  authDomain: "myapplication-9dc616cb.firebaseapp.com",
  projectId: "myapplication-9dc616cb",
  storageBucket: "myapplication-9dc616cb.firebasestorage.app",
  messagingSenderId: "62016559541",
  appId: "1:62016559541:web:b886f145252a1447c7a1fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
