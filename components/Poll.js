import { getAuth } from "firebase/auth";
import { Heading, HStack, Text, View, VStack, Button, Box } from "native-base";
import React, { useEffect, useState } from "react";
import db from "../db";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { familyId, FAMILY_TOKEN } from "../services/family-module";

const Poll = ({ post, postId }) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const [voted, setVoted] = useState(false);
  const [selection, setSelection] = useState(null);
  const [results, setResults] = useState(post.pollData);

  useEffect(() => {
    if (!post.votedIds) {
      return;
    }
    if (post.votedIds.includes(userId)) {
      console.log(postId, "already voted");
      setVoted(true);
    }
  }, []);

  if (!post.pollData) {
    return <Text> Bad poll </Text>;
  }

  const submitVote = async () => {
    const updatedPollData = post.pollData.map((elem, idx) =>
      selection == idx
        ? { option: elem.option, voteCount: elem.voteCount + 1 }
        : elem
    );
    setResults(updatedPollData);
    console.log(updatedPollData);
    try {
      await updateDoc(doc(db, "families", FAMILY_TOKEN, "posts", postId), {
        pollData: updatedPollData,
        votedIds: [...post?.votedIds, userId],
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
    setVoted(true);
  };

  return (
    <View bgColor="green">
      <HStack>
        <Heading fontWeight="300" size="sm">
          {post.userHandle}
        </Heading>
        <Heading fontWeight="100" size="sm">
          {post.createdAt}
        </Heading>
      </HStack>
      <Heading size="lg"> {post.title} </Heading>
      {voted ? (
        <>
          <Text> Results:  </Text>
          <VStack>
            {results.map((e, idx) => (
              <Box key={idx}>
                {/* <Text> {e.voteCount} </Text> */}
                <Box
                  w="50%"
                  p="0"
                  borderWidth={1}
                >
                <HStack display={"flex"} alignItems={"stretch"}><Text> {e.option}</Text><Text alignSelf={"flex-end"}> {e.voteCount}</Text></HStack>
                </Box>
              </Box>
            ))}
          </VStack>
        </>
      ) : (
        <>
          <Text> Vote </Text>
          <VStack>
            {post.pollData.map((e, idx) => (
              <Box key={idx}>
                <Button
                  onPress={() => setSelection(idx)}
                  w="50%"
                  p="0"
                  size="xs"
                >
                  {e.option}
                </Button>
              </Box>
            ))}
          </VStack>
          <Button isDisabled={voted} onPress={submitVote}>
            Submit
          </Button>
        </>
      )}
    </View>
  );
};

export default Poll;
