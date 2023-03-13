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
import { familyId } from "../services/family-module"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginForm from "../screens/LoginForm";
import SignUpForm from "../screens/SignUpForm";
import { useNavigation } from "@react-navigation/native";
import PostScreen from "../screens/PostScreen";
import Settings from "../screens/Settings";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import db from "../db";
import { getAuth } from "firebase/auth";
import { useState, useRef, useEffect } from 'react';
import * as Device from 'expo-device';
import * as ExpoNotifications from 'expo-notifications';

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

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await ExpoNotifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    ExpoNotifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const TabNavigation = () => {


  // React.useEffect(() => {
  //   requestUserPermission();
    
  
  //   return () => {
      
  //   }
  // }, [])
useEffect(() => {
  console.log("hey fam")
  // familyId(false).then((famId) => {
  //   console.log(famId);

  // })

  // return () => {
  //   second
  // }
}, [])



  //just commented this out:
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => { 
            if (!token) {
              return;
            }
            setExpoPushToken(token); 
            console.log("tab nav token", token); 
            await updateDoc(doc(db, "users", user?.uid), {
            displayName: user?.displayName,
            // familyId: user?.familyId,
            notificationToken: token
          });
        });
    notificationListener.current = ExpoNotifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = ExpoNotifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });


    return () => {
      ExpoNotifications.removeNotificationSubscription(notificationListener.current);
      ExpoNotifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);




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
