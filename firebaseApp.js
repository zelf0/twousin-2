import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCJsasNgIytE9l7yNTm7rI30T_ZsVnY-G4",
  // authDomain: "twousin-b6bd2.firebaseapp.com",
  projectId: "twousin-b6bd2",
  storageBucket: "twousin-b6bd2.appspot.com",
  messagingSenderId: "85932261764",
  appId: "1:85932261764:ios:5438aaa3089dfafa495dd1",
  // measurementId: "G-EE5Y7LLHRJ",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;