// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIKGE55AcY7KLTDsNTDzxcIDPGVTUjzFs",
  authDomain: "smart-hostel-gatepass.firebaseapp.com",
  projectId: "smart-hostel-gatepass",
  storageBucket: "smart-hostel-gatepass.firebasestorage.app",
  messagingSenderId: "661742943729",
  appId: "1:661742943729:web:7fc6ef321ef60308235850"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
