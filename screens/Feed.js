import React from "react";
import { Text, View } from "react-native";
import Posts from "../components/Posts";
import getFeed from "../services/getFeed";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { Box } from "native-base";
import db from "../db";
import {
  getDocs,
  collection,
  orderBy,
  query,
  onSnapshot,
  limit,
} from "firebase/firestore";

const Feed = ({ navigation }) => {
  // console.log("feed has ", navigation);
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            limit(30)), 
      (snapshot) => {
        setPosts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              })))
      },
      (error) => {
        console.error(error);
      });
    return unsubscribe;
  }, [])
  // useEffect(() => {
  //   let q = query(
  //     collection(db, "posts"),
  //     orderBy("createdAt", "desc"),
  //     //TODO: make it so at the bottom you can fetch more posts
  //     limit(20)
  //   );
  //   onSnapshot(q, (querySnapshot) => {
  //     setPosts(querySnapshot.docs);
  //   });
  //   return () => {
  //     setState({}); 
  //   };
  // }, []);

  // const [counter, setCounter] = useState(0);

  // const getPosts = async () => {

  //     try {
  //       const listener = await getFeed();
  //       // setPosts(docs.map((d) => d.data()));

  //       setPosts(docs);

  //     } catch (e) {
  //       console.error("Error getting posts: ", e);
  //     }
  // }

  // useEffect(() => {

  //     getPosts();

  // }, []);

  //   const q = query(collection(db, "posts"),
  //             orderBy("createdAt", "desc"),
  //             limit(20));
  //   // const querySnapshot = getDocs(q);
  //   // setPosts(querySnapshot.docs);

  //  onSnapshot(q, (querySnapshot) => {
  //     setPosts(querySnapshot.docs);
  //   });

  return (
    <Box width="100%" bg="green">
      {/* <PostButton openDialog = {openDialog}/> */}

      <Posts navigation={navigation} posts={posts} />
    </Box>
  );
};

export default Feed;
