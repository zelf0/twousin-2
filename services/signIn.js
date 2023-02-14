import firebaseApp from "../firebaseApp";
import {
    getAuth,
    signInWithEmailAndPassword,
  } from "firebase/auth";

const auth = getAuth(firebaseApp);
const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  export default signIn;