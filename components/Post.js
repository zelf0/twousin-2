import React from "react";
import { View } from "react-native";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import { Box, Text, Heading, VStack, HStack, ScrollView, Pressable } from "native-base";
import CommentForm from "./CommentForm";
import LongPost from "./LongPost";
import InnerPost from "./InnerPost";

const Post = ({ navigation, postData, id }) => {
  const [post, setPost] = useState(postData);
  const [comments, setComments] = useState([...post?.comments]);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    setComments([...post?.comments]);
  }, [post.comments, post.comments?.length]);


  //TODO: redo rerendering bbecause it doesn't work 
  //and i think the problem might be that the data is in the state of the component
  // instead of connected directly to the database
  const rerenderPost = () => {
    setRerender(rerender + 1);
  };

  const handlePress = () => {
    console.log("pressed", id)

    navigation.navigate('Post', {id: id});
  }

  return (
    <View
      width="100%"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Box width="100%" maxW="500px" bg="light.50" m={1} >
        <Pressable onPress = {handlePress} p="5" bg = "green">
          <InnerPost post={post} postId={id}/>  
        </Pressable>
        <VStack bg="#06024f" p="3">
          <ScrollView maxH={20}>
          {comments.map((comment, idx) => (
            <Comment comment={comment} key={idx} />
          ))}
          </ScrollView>
          <CommentForm rerenderPost={rerenderPost} id={id} />
        </VStack>
      </Box>
    </View>
  );
};

export default Post;
