import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyC31KTfkfPVv5GF34Y9QQ_QS7sQ64ytpig",
  authDomain: "gaming-society-45ca2.firebaseapp.com",
  projectId: "gaming-society-45ca2",
  storageBucket: "gaming-society-45ca2.appspot.com",
  messagingSenderId: "884669814824",
  appId: "1:884669814824:web:0f3779d81b988bf561fd1d",
  measurementId: "G-TSQSMY6LWS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app);