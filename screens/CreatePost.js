import {
  Box,
  HStack,
  Button,
  FormControl,
  Stack,
  Input,
  Text,
  TextArea,
} from "native-base";
import React from "react";
import BottomNav from "../components/BottomNav";
import { useState } from "react";
// import createNewPost from '../services/createNewPost'
// import * as ImagePicker from 'expo-image-picker';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import firebaseApp from "../firebaseApp";
import db from "../db";

import { collection, addDoc } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import FAMILY_TOKEN from "../services/FAMILY_TOKEN";

// import * as firebase from 'firebase';

const storage = getStorage(firebaseApp);

const CreatePost = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [selected, setSelected] = React.useState("short");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flair, setFlair] = useState("");
  const [topics, setTopics] = useState([]);
  const [uri, setUri] = useState("");
  const handleChange = (e) => {
    switch (e.target.id) {
      case "body":
        setBody(e.target.value);
        break;
      case "title":
        setTitle(e.target.value);
        break;
      case "flair":
        setFlair(e.target.value);
        break;
      case "topic":
        setTopics(
          e.target.checked
            ? [...topics, e.target.id]
            : topics.filter((topic) => topic !== e.target.id)
        );
        break;
      default:
        console.log("unexpected event object target", e.target.value);
        break;
    }
  };
  // const handleSubmit = () => {
  // //   e.preventDefault()
  // console.log("title", title);
  //   createNewPost({

  //     title: title,
  //     body: body,
  //     flair: flair,
  //     topics: topics,
  //     type: selected,
  //     uri: uri

  //   });
  //   navigation.navigate("Feed");
  // };

  const createPost = async () => {
    // if (!input && !privateMessage) {
    //   return;
    // }
    try {
      console.log("creating post", title);
      const docRef = await addDoc(collection(db, "families", 
      FAMILY_TOKEN, "posts"), {
        userHandle: user ? user?.displayName : "no user",
        // userHandle: "current user",
        title: title,
        body: body,
        createdAt: new Date().toISOString(),
        comments: [],
        topics: topics,
        flair: flair,
        type: selected,
        uri: uri,
      });
      // const docRef = await addDoc(collection(db, "chats"), {
      //   chatName: input,
      //   users: [auth.currentUser.uid, ...groupValue],
      //   createdBy: auth.currentUser.uid,
      //   createdAt:  new Date().toISOString(),
      //   latestTimestamp:  new Date().toISOString(),
      //   privateMessage: privateMessage
      // });
      console.log("Document written with ID: ", docRef.id);
      navigation.navigate("Feed");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onChooseImagePress = async () => {
    //TODO: Commenting this out because expo-image-picker is a brokie broke boy
    // let result = await ImagePicker.launchImageLibraryAsync();
    // if (!result.cancelled) {
    //   const uploadUrl = await uploadImage(result.uri);
    //   setUri(uploadUrl);
    // }
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
      `images/${Math.floor(Math.random() * 10000000000000000)}.jpg`
    );
    let uploadedRef = null;
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .catch((error) => {
        console.log(error);
      });
    return storageRef.toString();
  };

  const uploadImageAsync = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    // const blob = await new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();
    //   xhr.onload = function () {
    //     resolve(xhr.response);
    //   };
    //   xhr.onerror = function (e) {
    //     console.log(e);
    //     reject(new TypeError("Network request failed"));
    //   };
    //   xhr.responseType = "blob";
    //   xhr.open("GET", uri, true);
    //   xhr.send(null);
    // });
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(getStorage(), "image");
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  return (
    <Box alignItems="center">
      <Box w="100%" maxWidth="300px" alignItems="center">
        <FormControl>
          <Stack m="4">
            <Input
              placeholder="Type Something"
              onChangeText={(value) => setTitle(value)}
            />
            {/* <TextArea
              placeholder="Your Title Here"
              name="title"
              fullWidth
              id="title"
              label="Title"
              autoFocus
            //   onChange={setTitle}
              autoComplete = "off"
            /> */}
          </Stack>
        </FormControl>
        <HStack space="2" alignItems="center" p="2">
          <Button
            variant={selected === "short" ? "solid" : "outline"}
            colorScheme="green"
            onPress={() => {
              setSelected("short");
            }}
          >
            Quick Short Post
          </Button>
          <Button
            variant={selected === "long" ? "solid" : "outline"}
            colorScheme="green"
            onPress={() => {
              setSelected("long");
            }}
          >
            Article
          </Button>
          <Button
            variant={selected === "image" ? "solid" : "outline"}
            colorScheme="green"
            onPress={() => {
              setSelected("image");
            }}
          >
            Image
          </Button>
          <Button
            variant={selected === "poll" ? "solid" : "outline"}
            colorScheme="green"
            onPress={() => {
              setSelected("poll");
            }}
          >
            Poll
          </Button>
        </HStack>
        <FormControl
          display={selected === "long" ? "flex" : "none"}
          isRequired={selected === "long"}
        >
          <Stack mx="4">
            <TextArea
              h={400}
              placeholder="Your Post Here"
              onChangeText={(value) => setBody(value)}
            />
          </Stack>
        </FormControl>
        <Box display={selected === "image" ? "flex" : "none"}>
          <Button title="Choose Image..." onPress={onChooseImagePress}>
            Choose Image...
          </Button>
        </Box>
        <Box display={selected === "poll" ? "flex" : "none"}>
          <Text> Todo </Text>
        </Box>
        {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
        <Button
          title="Submit"
          onPress={createPost}
          type="submit"
          fullWidth
          m="4"
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePost;
