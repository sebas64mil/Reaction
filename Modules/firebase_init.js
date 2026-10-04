import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTSeqBTOUyEskv7imuPbo9o9Cfn_Bdzfc",
  authDomain: "reactionhoops.firebaseapp.com",
  projectId: "reactionhoops",
  storageBucket: "reactionhoops.firebasestorage.app",
  messagingSenderId: "966942385916",
  appId: "1:966942385916:web:3e63d48032cfd754d51979"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);