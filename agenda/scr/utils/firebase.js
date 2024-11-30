// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDplmMzrRxrB1KoaXy0qZZJ7hfHrhslZ3c",
  authDomain: "agendaapp-ff8f4.firebaseapp.com",
  projectId: "agendaapp-ff8f4",
  storageBucket: "agendaapp-ff8f4.firebasestorage.app",
  messagingSenderId: "604855127757",
  appId: "1:604855127757:web:61bedd48ef63ddbdf0e384"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
