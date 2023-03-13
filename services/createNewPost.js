import db from "../db";

import {
    collection,
    addDoc,
  } from "firebase/firestore";
  
import { getAuth } from "firebase/auth";
import { FAMILY_TOKEN } from "./family-module";

 

const createNewPost = async (post) => {
  
  const auth = getAuth();
  const user = auth.currentUser;

  console.log('posting')
  console.log(user, user?.providerData, user?.providerData?.email);
    try {
      console.log('posting', post)
      const docRef = await addDoc(collection(db, "families", 
      FAMILY_TOKEN, "posts"), {
        userHandle: user ? user?.displayName : "no user",
        // userHandle: "current user",
        title: post.title,
        body: post.body,
        createdAt: new Date().toISOString(),
        comments: [],
        topics: post.topics,
        flair: post.flair,
        type: post.type,
        uri: post.uri
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    console.log()
  };

  export default createNewPost;