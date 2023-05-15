import { getAuth } from "firebase/auth";
import {
  Box,
  View,
  Image,
  VStack,
  HStack,
  Button,
  KeyboardAvoidingView,
  Center,
  Input,
  ScrollView,
  Text,
  Icon,
  IconButton,
  ZStack,
  FlatList,
  Badge,
  PresenceTransition,
} from "native-base";
import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Keyboard, SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db from "../db";
// import { manipulateAsync } from 'expo-image-manipulator';
import {
  collection,
  query,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import Message from "../components/Message";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import GameLobby from "../components/GameLobby";
import ChatInput from "../components/ChatInput";
import Messages from "../components/Messages";
import { FAMILY_TOKEN } from "../services/family-module";

const auth = getAuth();
const storage = getStorage();

const ChatScreen = ({ navigation, route }) => {
  // console.log(auth.currentUser);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitle: () => <Text> {route.params.chatName} </Text>,
    });

    //   return () => {
    //     second
    //   };
  }, [navigation]);

  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [gameLobbyOpen, setGameLobbyOpen] = useState(false);
  const [gameType, setGameType] = useState("");
  const [gameState, setGameState] = useState(null);
  const [replyIdx, setReplyIdx] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [messagesCount, setMessagesCount] = useState(route.params.messagesCount);

  // useEffect(() => {
    //i was thinking of making a useeffect for messages count but actually i think that's too many read writes because i would have to make a wholle snapshot for the messages and count them i should probably just change the mssages count
  //   db, "families", FAMILY_TOKEN, "chats", route.params.id, "messages";
  //   const chatRef = db.collection(db, "families", FAMILY_TOKEN, "chats").doc(route.params.id);
  //   const messagesRef = chatRef.collection("favorites");

  //   route.params.id;
  //   setMessagesCount(count);

  //   // return () => {
  //   //   second
  //   // }
  // }, []);

  const removePhoto = (imageToRemove) => {
    setImages(images.filter((img) => img != imageToRemove));
  };

  const reply = (idx, message) => {
    console.log(idx);
    setReplyIdx(messagesCount - idx);
    setReplyMessage(message);
  };

  const createNewGame = (type, state) => {
    setGameType(type);
    setGameState(state);
  };

  const openGameLobby = () => {
    setGameLobbyOpen(!gameLobbyOpen);
    Keyboard.dismiss();
  };

  const addMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
      console.log(images[0]);
      // let img = addImage(result.uri)
      // setUri(img);
    }
  };

  const uploadImages = async () => {
    const imageRefs = [];
    for (let i = 0; i < images?.length; i++) {
      console.log("uploading..", images[i]);
      // const compressedImageData = (await manipulateAsync(images[i], { resize: { width: 250 } }));
      // const uploadUrl = await uploadImage(compressedImageData);
      const uploadUrl = await uploadImage(images[i]);
      console.log("upload url", uploadUrl);
      imageRefs.push();
      // setUploadedImages([...uploadedImages, uploadUrl]);
      // console.log("images", uploadedImages[i]);
    }
    return imageRefs;
  };

  const sendMessage = async (input) => {
    if (!input && images.length == 0 && !gameType) {
      return;
    }

    console.log("start function");
    Keyboard.dismiss();
    // const imageRefs = await uploadImages();
    const imageRefs = [];
    for (let i = 0; i < images?.length; i++) {
      console.log("uploading..", images[i]);
      // const compressedImageData = (await manipulateAsync(images[i], { resize: { width: 250 } }));
      // const uploadUrl = await uploadImage(compressedImageData);
      const uploadUrl = await uploadImage(images[i]);
      console.log("upload url", uploadUrl);
      // setUploadedImages([...uploadedImages, uploadUrl]);
      // console.log("images", uploadedImages[i]);
      imageRefs.push(uploadUrl);
    }

    console.log("reset state");
    //  console.log("IMAGE.  ", uploadedImages[0]);
    try {
      console.log("in try statement");
      const docRef = await addDoc(
        collection(
          db,
          "families",
          FAMILY_TOKEN,
          "chats",
          route.params.id,
          "messages"
        ),
        {
          timestamp: new Date().toISOString(),
          message: input,
          displayName: auth.currentUser.displayName,
          senderId: auth.currentUser.uid,
          images: imageRefs,
          gameType: gameType,
          gameState: gameState,
          replyIdx: replyIdx,
          replyMessage: replyMessage,
        }
      );
      console.log("added doc ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
    try {
      await updateDoc(
        doc(db, "families", FAMILY_TOKEN, "chats", route.params.id),
        {
          latestTimestamp: new Date().toISOString(),
          messagesCount: messagesCount + 1,
        }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
    setImages([]);
    setUploadedImages([]);
    setGameType("");
    setGameState(null);
    setReplyIdx(null);
    setReplyMessage(null);
    setMessagesCount(messagesCount + 1);
  };

  const uploadImage = async (uri) => {
    // const response = await fetch(uri);
    // const blob = await response.blob();
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    //TODO: better id generator than math.random
    const storageRef = ref(
      storage,
      `chatImages/${Math.floor(Math.random() * 10000000000000000)}.jpg`
    );
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .catch((error) => {
        console.log(error);
      });
    return storageRef.toString();
  };

  // useEffect(() => {
  //   let i = 0;
  //   const intervalToken = setInterval(() => {
  //     console.log(i);
  //     i++;
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalToken);
  //   }
  // }, [])

  return (
    <SafeAreaView>
      <Text>{route.params.chatName}</Text>
      <KeyboardAvoidingView
        h={
          gameLobbyOpen
            ? { base: "70%", lg: "auto" }
            : {
                base: "95%",
                lg: "auto",
              }
        }
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}

        <Messages chatId={route.params.id} onReply={reply} messagesCount={messagesCount}/>
        <Center bottom={0} style={styles.footer}>
          {/* <ScrollView maxH={200}> */}
          {/* {images.map((image, idx) => 
              <Image key={idx} source={{
                uri: image
              }} alt="Alternate Text" size="xl" />)} */}
          {/* flat list of images, which may or may not be an empty array */}
          <FlatList
            numColumns={3}
            data={images}
            renderItem={({ item }) => {
              // return <Image m="1" source={{uri: item}} alt="Alternate Text" size="md" />;
              return (
                <Box alignItems="center">
                  <VStack>
                    {/* <IconButton 
      onPress={removePhoto} p="2" rounded="full" colorScheme="secondary" rounded="full" mb={-7} mr={1} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
        fontSize: 12
      }} /> */}
                    <IconButton
                      onPress={() => removePhoto(item)}
                      rounded="full"
                      colorScheme="secondary"
                      mb={-8}
                      mr={0}
                      zIndex={1}
                      alignSelf="flex-end"
                      size="sm"
                      variant="solid"
                      _icon={{
                        as: MaterialIcons,
                        name: "clear",
                      }}
                    />
                    <Image
                      m="1"
                      source={{ uri: item }}
                      alt="Image - No alt text"
                      size="xl"
                    />
                  </VStack>
                </Box>
              );
            }}
          />
          {/* element representing selected game, if there is one */}
          {gameType ? (
            <HStack>
              <Text> Let's play {gameType} </Text>
              <Button
                onPress={() => {
                  setGameType("");
                  setGameState(null);
                }}
                size={10}
              >
                Clear
              </Button>
            </HStack>
          ) : (
            <></>
          )}
          {/* </ScrollView> */}
          {replyIdx !== null ? (
            <Box>
              <Text> Replying to {replyMessage}</Text>
              <IconButton
                icon={<Icon size={7} as={Ionicons} name="close" />}
                onPress={() => {
                  console.log("close repl");
                  setReplyIdx(null);
                  setReplyMessage(null);
                }}
              />
            </Box>
          ) : (
            <></>
          )}
          <ChatInput
            onSendMessage={sendMessage}
            onAddMedia={addMedia}
            onOpenGameLobby={openGameLobby}
          />
        </Center>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
      <View display={gameLobbyOpen ? "flex" : "none"}>
        <GameLobby createNewGame={createNewGame} />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    bottom: 0,
  },
  textInput: {},
});
