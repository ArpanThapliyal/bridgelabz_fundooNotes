
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJeoVQ_ljBrWQHJAl1e4ldk6kAncSoxEc",
  authDomain: "fundoonotes-b501b.firebaseapp.com",
  projectId: "fundoonotes-b501b",
  storageBucket: "fundoonotes-b501b.firebasestorage.app",
  messagingSenderId: "473872042123",
  appId: "1:473872042123:web:c13d690be4429f0d7b6c8e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
