import React from "react";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import Posts from "../components/Posts";
import { useState, useEffect, useCallback } from "react";
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
import { familyId, FAMILY_TOKEN } from "../services/family-module";

const Feed = ({ navigation }) => {
  // console.log("feed has ", navigation);
  const [posts, setPosts] = useState([]);
  // const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //       setRefreshing(false);
  //   }, 2000);
  // }, []);

  // useEffect(() => {

  //   const unsubscribe = onSnapshot(
  //     query(
  //           collection(db, "posts"),
  //           orderBy("createdAt", "desc")
  //           // limit(30)
  //           ),
  //     (snapshot) => {
  //       setPosts(
  //             snapshot.docs.map((doc) => ({
  //               id: doc.id,
  //               data: doc.data(),
  //             })));
  //     },
  //     (error) => {
  //       console.error(error);
  //     });

  //   return unsubscribe;
  // }, [])

  useEffect(() => {
    // familyId().then((famId) => {
    //   console.log("in feed", famId);
    //   if (!famId) {
    //     console.log("fam is empty");
    //     return;
    //   }
    //   const unsubscribe = onSnapshot(
    //     query(collection(db, "families",
    //     famId, "posts"), orderBy("createdAt", "desc")),
    //     (snapshot) => {
    //       setPosts(
    //         snapshot.docs.map((doc) => ({
    //           id: doc.id,
    //           data: doc.data(),
    //         }))
    //       );
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    //   return unsubscribe;

    // })
    const unsubscribe = onSnapshot(
      query(
        collection(db, "families", FAMILY_TOKEN, "posts"),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({
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
    <Box width="100%" bg="green">
      {/* <PostButton openDialog = {openDialog}/> */}
      <ScrollView
        width="100%"
        bg="primary.500"
        showsVerticalScrollIndicator={true}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text> Posts </Text>
        {posts.map((post) => (
          <Post
            navigation={navigation}
            postData={post.data}
            id={post.id}
            key={post.id}
          />
        ))}
      </ScrollView>
      {/* <Posts navigation={navigation} posts={posts} /> */}
    </Box>
  );
};

export default Feed;
