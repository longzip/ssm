// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

// PUT YOUR OWN FIREBASE CONFIGURATION HERE
var firebaseConfig = {
  apiKey: "AIzaSyDraj3RaCTiGTK_Alsbslb-kbelw9Iyhgw",
  authDomain: "gvc-task.firebaseapp.com",
  projectId: "gvc-task",
  storageBucket: "gvc-task.appspot.com",
  messagingSenderId: "194642192267",
  appId: "1:194642192267:web:66bedc6e262d9fce83318e",
};

// Initialize Firebase
let firebaseApp = initializeApp(firebaseConfig);
let firebaseAuth = getAuth(firebaseApp);
let firebaseDb = getDatabase(firebaseApp);

export { firebaseAuth, firebaseDb };