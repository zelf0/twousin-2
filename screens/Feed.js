import React from "react";
import { Text, View, ScrollView } from "react-native";
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
import Post from "../components/Post";

const Feed = ({ navigation }) => {
  // console.log("feed has ", navigation);
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            // limit(30)
            ), 
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
  //   const unsubscribe = onSnapshot(
  //     collection(db, "posts"),
  //     (snapshot) => {
  //       const posts = snapshot.docs
  //         .map((doc) => ({ id: doc.id, data: doc.data() }))
  //         .sort((a, b) => b.data.createdAt - a.data.createdAt) // sort by createdAt timestamp in descending order
  //         .slice(0, 30); // limit to the 30 most recent posts
  
  //       setPosts(posts);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  
  //   return unsubscribe;
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
      <ScrollView width = "100%" bg = "primary.500" showsVerticalScrollIndicator={true} > 
                <Text> Posts </Text>
                {posts.map((post, idx) => <Post navigation={navigation} postData={post.data} id = {post.id} key = {idx}/>)}
            </ScrollView>
      {/* <Posts navigation={navigation} posts={posts} /> */}
    </Box>
  );
};

export default Feed;
