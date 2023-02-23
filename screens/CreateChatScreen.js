import React, { useState, useEffect } from "react";
import { Button, Center, Heading, Input, Text, ScrollView, Checkbox } from "native-base";
import db from "../db";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where
} from "firebase/firestore";
import { Pressable } from "react-native";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const CreateChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [groupValue, setGroupValue] = useState([]);

  // const createChat = async () => {
  //     await db.collection("chats").add({
  //         chatName: input
  //     }).then(() => {
  //         navigation.goBack()
  //     }).catch((error) => alert(error))
  // };

  const createChat = async () => {
    if (!input) {
      return;
    }
    try {
      console.log("creating chat", input);
      const docRef = await addDoc(collection(db, "chats"), {
        chatName: input,
        users: [auth.currentUser.uid, ...groupValue],
        createdBy: auth.currentUser.uid,
        createdAt:  new Date().toISOString(),
        latestTimestamp:  new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);
      navigation.navigate("Lobby");
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users"), where("displayName", "!=", auth.currentUser.displayName), orderBy("displayName", "asc")),
      (snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <Center>
      <Heading> Create Chat </Heading>
      <Input
        placeholder="Name your chat"
        value={input}
        onChangeText={(text) => setInput(text)}
      />
      {/* <Text> {groupValue} </Text> */}
      <ScrollView>
        {/* {users.map(({id, data : { displayName }}) => 
      <Pressable bgColor="primary.500">
        <Text>
        {displayName}
        </Text>
        </Pressable>)} */}

        <Checkbox.Group
          colorScheme="primary"
          defaultValue={groupValue}
          accessibilityLabel="choose members"
          onChange={(values) => {
            setGroupValue(values || []);
          }}
        >
          {users.map(({ id, data: { displayName } }) => (
            <Checkbox key={id} value={id} my="1">
              {displayName}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </ScrollView>
      <Button title="Create chat" onPress={createChat}>
        Create Chat
      </Button>
    </Center>
  );
};

export default CreateChatScreen;
