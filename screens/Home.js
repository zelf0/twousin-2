import { Box } from "native-base";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";
import TabNavigation from "../components/TabNavigation";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = ({ navigation }) => {

const auth = getAuth();
const user = auth.currentUser;

const [loggedIn, setLoggedIn] = useState(!!user);


// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     setLoggedIn(true)
//   } else {
//     setLoggedIn(false)
//   }
// });


// onAuthStateChanged(auth, (user) => {
  if (loggedIn) {
    return (
      <TabNavigation />
    );
  } else {
    return (
      <LoginForm />
    );
  }
// });



}

export default Home;
