// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeppQnVo-iSRmGhNR8_XDLC1r1JvTvWVs",
  authDomain: "inventory-manager-4ca43.firebaseapp.com",
  projectId: "inventory-manager-4ca43",
  storageBucket: "inventory-manager-4ca43.appspot.com",
  messagingSenderId: "539063798080",
  appId: "1:539063798080:web:3493c0a910810f007d52a5",
  measurementId: "G-5W16T7L3MF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
