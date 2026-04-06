import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCzzAs4JyQlCXwXdsouW1BbEkhiqJnZur0",
  authDomain: "neosapp-5498c.firebaseapp.com",
  projectId: "neosapp-5498c",
  storageBucket: "neosapp-5498c.firebasestorage.app",
  messagingSenderId: "628969088717",
  appId: "1:628969088717:web:39cb94a55ae3597b0eab84"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); //
export { auth, db };
