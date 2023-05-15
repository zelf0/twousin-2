import { Box, Center, Text, Image, HStack, Pressable, Menu, Button } from 'native-base'
import React, { useState, useEffect, memo } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import GameMessage from './GameMessage';
// import { Image } from 'react-native'
import * as Clipboard from 'expo-clipboard';

const auth = getAuth();
const storage = getStorage();

const Message = memo(({data, chatId, messageId, onReply, flatListRef, index, highlight, highlighted, messagesCount}) => {

  const [downloadedImages, setDownloadedImages] = useState([])


  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(data.message);
  };

 useEffect(() => {
  for (let i = 0; i < data.images?.length; i++) {
    getDownloadURL(ref(storage, data.images[i])).then((url) => {
      setDownloadedImages([...downloadedImages, url]);
    }).catch((e) => {
      setDownloadedImages([...downloadedImages, ""]);
      console.log(e);
    });
  }
 return () => {
    setDownloadedImages([]);
  }
 }, [])
 
    const self = (data.senderId == auth.currentUser.uid)
    const convertDate = (isoString) => {
      if (!isoString) {
        return "";
      }
      const date = new Date(isoString);
      return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }

  // if (data.gameType){
  //   return (<GameMessage chatId={chatId} messageId={messageId} gameState={data.gameState} gameType={data.gameType} self={self} />)
  // }
  
  return (
    <Box m={2} alignItems = {self ? "flex-end" : "flex-start"}>
        <Menu placement={self ? "left" : "right"} w="190" trigger={triggerProps => {
        return <Pressable accessibilityLabel="Message options" {...triggerProps} p={2} borderRadius={20} maxW="55%" minW="20%" bgColor={self ? "primary.500" : "white"} opacity={index === highlighted ? "50" : "100"}>
        {/* TODO: make displa name from uid instead iof hardcoded in caase someone changes their name- need to be using admin sdk
        <Text fontSize={10} color={self ? "white" : "primary.900"}> {auth.getUser(data.senderId).displayName} </Text> */}
       {data.replyMessage ? <Button onPress={() => { 
        highlight(messagesCount - data.replyIdx); 
        console.log("count", messagesCount, "idx", data.replyIdx, "subtracted", messagesCount - data.replyIdx); 
        flatListRef.current.scrollToIndex({animated: true, index: messagesCount - data.replyIdx});}} 
        borderLeftWidth={3} p={0} h={30}> {data.replyMessage} </Button> : <></>}
        <HStack>
            <Text fontSize={10} color={self ? "white" : "primary.900"}> {data.displayName} </Text>
            <Text fontSize={8} color={self ? "white" : "primary.900"}> {convertDate(data.timestamp)} </Text>
          </HStack>

          {data.gameType ? <GameMessage chatId={chatId} messageId={messageId} gameState={data.gameState} gameType={data.gameType} self={self} /> : <></>}
            <Text fontSize={17} color={self ? "white" : "primary.500"}> {data.message} </Text>
            {downloadedImages?.map((image, idx) => 
            <Box key={idx} >
              {(image) ? <Image key={idx} source={{
                uri: image
              }} size="xl" alt="Alternate Text" style={{
                resizeMode: "contain",
              }}/> : <Text> Uploading Image... </Text>}      
            </Box >     
            )}
        </Pressable>
         }}>
         <Menu.Item onPress={() => {onReply(index, data.message)}}>Reply</Menu.Item>
         <Menu.Item onPress={copyToClipboard}>Copy</Menu.Item>
       </Menu>
    </Box>
  )
})

export default Message