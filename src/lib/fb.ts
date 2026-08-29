import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARKmJgJEBS8w8wJL_C8dPR2mPM2cOD6ScM8",
  authDomain: "imr-adrar.firebaseapp.com",
  projectId: "imr-adrar",
  storageBucket: "imr-adrar.firebasestorage.app",
  messagingSenderId: "628104421695",
  appId: "1:628104421695:web:8dc766cd263e42b11f338a",
  measurementId: "G-BVB7Y319YB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);