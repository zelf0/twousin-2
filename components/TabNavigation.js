import * as React from "react";
import { View, Text } from "react-native";
import { Box } from 'native-base';
import {
  NavigationContainer,
  DefaultTheme,
  TabActions,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Feed from "../screens/Feed";
import { NativeBaseProvider } from "native-base";
import ChatLobbyScreen from "../screens/ChatLobbyScreen";
import CreatePost from "../screens/CreatePost";
import Notifications from "../screens/Notifications";
import BottomNav from "../components/BottomNav";


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginForm from "../screens/LoginForm";
import SignUpForm from "../screens/SignUpForm";
import { useNavigation } from "@react-navigation/native";
import PostScreen from "../screens/PostScreen";
import Settings from "../screens/Settings";
import { doc, setDoc } from "firebase/firestore";
import db from "../db";
import { getAuth } from "firebase/auth";
import { useState } from 'react';

const Tab = createBottomTabNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: "rgb(255, 45, 85)",
    // background: '#bacdd4',
    background: "white",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
  },
};

const TabNavigation = () => {


  // React.useEffect(() => {
  //   requestUserPermission();
    
  
  //   return () => {
      
  //   }
  // }, [])



  //just commented this out:
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  // async function requestUserPermission() {
  //   const authorizationStatus = await messaging().requestPermission();
  //   // const token = null;
  
  //   if (authorizationStatus) {
  //     console.log('Permission status:', authorizationStatus);
  //     await messaging().registerDeviceForRemoteMessages();
  //     const fcmToken = await messaging().getToken();
  //     await setDoc(doc(db, "users", user?.uid), {
  //       displayName: user?.displayName,
  //       notificationToken: fcmToken
  //     });
  //     // console.log("token: ", token, fcmToken);
  //   }



  return (


      <Tab.Navigator
        tabBar={(props) => (
          <BottomNav {...props} stackNavigation={navigation} />
        )}
      >
        <Tab.Group>
          <Tab.Screen name="Feed" component={Feed} theme={MyTheme} />
           <Tab.Screen name="Lobby" component={ChatLobbyScreen} initialParams={{stackNavigation: navigation}} />
          <Tab.Screen name="Create Post" component={CreatePost} />
          <Tab.Screen name="Notifications" component={Notifications} />
          <Tab.Screen name="Settings" component={Settings} /> 
        </Tab.Group>
        <Tab.Group screenOptions={{ presentation: "modal" }}>
          <Tab.Screen name="Post" component={PostScreen} />
        </Tab.Group>
      </Tab.Navigator>
  
  );
};

export default TabNavigation;
