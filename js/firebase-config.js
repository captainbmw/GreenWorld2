// Firebase Realtime Database configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9AanYqJf9nWT44xbs7LYIk_C9SsKe-kI",
    authDomain: "greenworldstore-e00c4.firebaseapp.com",
    databaseURL: "https://greenworldstore-e00c4-default-rtdb.firebaseio.com/",
    projectId: "greenworldstore-e00c4",
    storageBucket: "greenworldstore-e00c4.appspot.com",
    messagingSenderId: "1062777777569",
    appId: "1:1062777777569:web:385dc7ad92836b3ecb6fe0",
    measurementId: "G-WEN12J8DT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
