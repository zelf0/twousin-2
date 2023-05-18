// import { initializeApp } from "firebase/app";
// import { FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   // authDomain: "twousin-b6bd2.firebaseapp.com",
//   projectId: "twousin-b6bd2",
//   storageBucket: "twousin-b6bd2.appspot.com",
//   messagingSenderId: "85932261764",
//   appId: "1:85932261764:ios:5438aaa3089dfafa495dd1",
//   // measurementId: "G-EE5Y7LLHRJ",
// };

// const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: FIREBBASE_API_KEY,
//   // authDomain: AUTH_DOMAIN,
//   projectId: PROJECT_ID,
//   storageBucket: STORAGE_BUCKET,
//   messagingSenderId: MESSAGING_SENDEER_ID,
//   appId: APP_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;

import { FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  // apiKey: "AIzaSyCJsasNgIytE9l7yNTm7rI30T_ZsVnY-G4",
  // authDomain: AUTH_DOMAIN,
  // projectId: "twousin-b6bd2",
  // storageBucket: "twousin-b6bd2.appspot.com",
  // messagingSenderId: "85932261764",
  // appId: "1:85932261764:ios:5438aaa3089dfafa495dd1",
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;