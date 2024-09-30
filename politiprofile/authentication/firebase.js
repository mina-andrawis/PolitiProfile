// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtJ-XI3R5jOMmx-NP_EzIr0HkNJ26kVGw",
  authDomain: "politiprofile.firebaseapp.com",
  databaseURL: "https://politiprofile-default-rtdb.firebaseio.com",
  projectId: "politiprofile",
  storageBucket: "politiprofile.appspot.com",
  messagingSenderId: "613941259275",
  appId: "1:613941259275:web:70be2b90e9b60d07172b0e",
  measurementId: "G-P90P2KEKJ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
