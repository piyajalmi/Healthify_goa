import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDXCW0vNdEB42LJ11ek-NH1yZNcMSSMVE",
  authDomain: "healthifygoa.firebaseapp.com",
  projectId: "healthifygoa",
  storageBucket: "healthifygoa.firebasestorage.app",
  messagingSenderId: "74521965324",
  appId: "1:74521965324:web:fc3f1032f4c15c5917cf29"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
