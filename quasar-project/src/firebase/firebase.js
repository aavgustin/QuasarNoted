import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAJBhq5z_RfteMOz2z1iXcj0Uq2URPwnWk",
  authDomain: "notedfirebase.firebaseapp.com",
  projectId: "notedfirebase",
  storageBucket: "notedfirebase.firebasestorage.app",
  messagingSenderId: "542456717235",
  appId: "1:542456717235:web:f8bab45ca8b5d48305f5c6",
  measurementId: "G-E60D51CS73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

//export varijable ostatku aplikacije
//importa se kao "import { db } from 'src/firebase/firebase'"
export{
    db
}