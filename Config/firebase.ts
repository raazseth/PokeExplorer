import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD960xP0T2djmIVffb0ppDpZTjVJtxQyxE",
  authDomain: "pokemonapp-a6309.firebaseapp.com",
  projectId: "pokemonapp-a6309",
  storageBucket: "pokemonapp-a6309.firebasestorage.app",
  messagingSenderId: "42493050260",
  appId: "1:42493050260:web:978c11274f7f0993642381",
  measurementId: "G-PKNY325VL2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
