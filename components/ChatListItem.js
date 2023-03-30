import {
  View,
  Box,
  Center,
  Text,
  Heading,
  Pressable,
  HStack,
} from "native-base";
import { SafeAreaView, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import db from "../db";
import { FAMILY_TOKEN } from "../services/family-module";

const ChatListItem = ({ chatName, id, enterChat, messagesCount }) => {
  const [lastMessage, setLastMessage] = useState({
    message: "...",
    timestamp: null,
  });

  // useEffect(() => {
  //   const unsubscribe = db.collection('chats').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot((snap) => {
  //     setLastMessage(snap.docs[0].data());
  //   })

  //   return unsubscribe;
  // }, [])
  console.log("num messages", messagesCount);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "families", 
        FAMILY_TOKEN, "chats", id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        if (snapshot?.docs[0]?.data()) {
          setLastMessage(snapshot?.docs[0]?.data());
        } else {
          //set timestamp to when the chat was created
        }
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }, []);

  const navigateToChat = () => {
    enterChat(id, chatName, messagesCount);
  };

  const convertDate = (isoString) => {
    if (!isoString) {
      return "";
    }
    const date = new Date(isoString);
    const today = new Date();
    let str = "";

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      str += date.getHours();
      str += ":";
      str += date.getMinutes();
    }

    //TODO: check for yesterday
    else if (
      date.getDate() - today.getDate() === 1 &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      str += "Yesterday";
    }

    //TODO: check for this weeek
    else if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      str += date.getDay();
    } else {
      str += `${date.toLocaleString("default", { month: "short" })} `;
      str += date.getDate();
      if (today.getFullYear() !== date.getFullYear()) {
        str += date.getFullYear();
      }
    }
    return str;
  };

  return (
    // <Pressable  h={70} paddingTop = {1} paddingLeft = {10} borderTopWidth="0.5" borderBottomWidth="0.5" borderColor="light.300" colorScheme="light" onPress={navigateToChat}>
    //   <Text bold fontSize="md">
    //    {chat}
    //   </Text>
    // </Pressable>
    <Pressable w="100%" onPress={navigateToChat}>
      {({ isFocused, isPressed }) => {
        return (
          <Box
            bg={isPressed ? "coolGray.200" : "coolGray.100"}
            paddingTop="1"
            paddingLeft="10"
            shadow={3}
            borderWidth="0.5"
            borderColor="coolGray.300"
            h={90}
          >
            {/* <Text color="coolGray.800" mt="3" fontWeight="medium" fontSize="xl"> */}
            <HStack d="flex" justifyContent="space-between">
              <Text bold fontSize="md">
                {chatName}
              </Text>
              <Text color="darkBlue.500">
                {convertDate(lastMessage.timestamp)}{" "}
              </Text>
            </HStack>
            <Text color="dark.300" fontSize="sm">
              {lastMessage.displayName}: {lastMessage.message}
            </Text>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default ChatListItem;
