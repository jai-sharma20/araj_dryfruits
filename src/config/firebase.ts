import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-SBKYsGgXmRBithZOUJetlHkF1dXsBmw",
  authDomain: "araj-dryfruits.firebaseapp.com",
  projectId: "araj-dryfruits",
  storageBucket: "araj-dryfruits.firebasestorage.app",
  messagingSenderId: "486868360527",
  appId: "1:486868360527:web:a172ebf593db19a2c5793a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Get Firestore instance
export const db = getFirestore(app);

export { auth };
export default app; 