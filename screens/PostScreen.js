import { getPathFromState } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { Box, Heading, Text, View, VStack } from 'native-base'
import React, { useState, useEffect } from 'react'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import db from '../db'
import { FAMILY_TOKEN } from '../services/family-module'

const PostScreen = ({route}) => {

    const [post, setPost] = useState({});
    const [id, setId] = useState(route.params.id);

    const getPost = async () => {
        console.log(id);
        const docRef = doc(db, "families", 
        FAMILY_TOKEN, "posts", route.params.id);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap);
        setPost(docSnap.data());
        // console.log(post);
    }

    useEffect(() => {
      getPost();
    }, [route.params.id])
    


  return (
    <Box> 
        <Text> Post with id: {route.params.id} </Text> 
      <Box width="100%" bg="#f2edf2">
        <Box p="5" bg = "green">
          <Heading fontWeight="100" size="sm">
            {" "}
            {post.userHandle}{" "}
          </Heading>
          <Heading size="lg"> {post.title} </Heading>
          <Heading size="sm"> {post.flair} </Heading>
          {post.topics?.map((topic, idx) => (
            <Text key={idx}> {topic} </Text>
          ))}
          <Text> {post.body} </Text>
        </Box>
        <VStack space={4} bg="#06024f" p="4">
          {/* 3c3746  purple dark*/}
          {post?.comments?.map((comment, idx) => (
            <Comment comment={comment} key={idx} />
          ))}
          <CommentForm  id={route.params.id} />
        </VStack>
      </Box>
    </Box>
  )
}

export default PostScreen