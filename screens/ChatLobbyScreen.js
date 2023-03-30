import { View, Box, Center, Button, Text, Icon, IconButton, VStack} from 'native-base'
import { SafeAreaView, ScrollView } from 'react-native'
import { useState, useEffect, useLayoutEffect } from 'react'
import ChatListItem from '../components/ChatListItem'
import db from '../db'
import {
  getDocs,
  collection,
  orderBy,
  where,
  query,
  onSnapshot,
  getDoc,
  limit
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Ionicons,
} from "@expo/vector-icons";
import getNameFromUserId from '../services/getNameFromUserId'
import { FAMILY_TOKEN } from '../services/family-module'

const auth = getAuth();

const ChatLobbyScreen = ({navigation, route}) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton 
        icon={<Icon size={7} as={Ionicons} name="create-outline" />} 
         onPress={createChat} />
      ),

      // headerRight: () => (
      //   <Button title="hi" onPress={createChat} />
      // ),

    });
  }, [navigation]);

  const { stackNavigation } = route.params;
  // console.log("stak navigation", stackNavigation)

  const createChat = () => {
    stackNavigation.navigate("Create Chat");
 } 
 const [chats, setChats] = useState([]);


useEffect(() => {

  const unsubscribe = onSnapshot(
    query(collection(db, "families", 
    FAMILY_TOKEN, "chats"),
    where("users", "array-contains", auth.currentUser.uid),
    orderBy("latestTimestamp", "desc")), 
    (snapshot) => {
      setChats(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            })))
      getLatestMessageFromChat().then((message) => {
        console.log(message)
        //modify chats so each chat also has a message field
      })
      
    },
    (error) => {
      console.error(error);
    });
  return unsubscribe;
}, [])

const enterChat  = (id, chatName, messagesCount) => {
  stackNavigation.navigate("Chat", {
    id: id,
    chatName: chatName,
    messagesCount: messagesCount,
  });
}

const getLatestMessageFromChat = async (chatId) => {



}

const getNameFromUsers = (users) => {
  return getNameFromUserId(users.find((e) => e !== auth.currentUser.uid));
}
 
 return (
    <Center bgColor="amber.300" w="100%" safeArea p="0"> 

      <ScrollView m="0" width="100%" showsVerticalScrollIndicator={true}> 
       
      {chats.map(({id, data : { chatName, privateMessage, users, messagesCount }}) => 
      <ChatListItem 
        id={id}
        chatName={privateMessage ? getNameFromUsers(users) : chatName} 
        messagesCount={messagesCount ? messagesCount : 0}
        key={id}
        enterChat={enterChat}
        />)}
        {/* <ChatListItem /> */}
      </ScrollView>
    </Center>
  )
}

export default ChatLobbyScreen;