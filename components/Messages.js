import { FlatList } from 'native-base'
import React, { useEffect, useState, useRef, memo } from 'react'
import Message from './Message'
import db from "../db";
import {
  collection,
  query,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FAMILY_TOKEN } from '../services/family-module';

const Messages = memo(({chatId, onReply, messagesCount}) => {

    const [messages, setMessages] = useState([]);
    const [highlighted, setHighlighted] = useState(null);

    const highlight = (idx) => {
      setHighlighted(idx);
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(
          query(
            collection(db, "families", 
            FAMILY_TOKEN, "chats", chatId, "messages"),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => {
            setMessages(
              snapshot.docs.map((doc) => ({
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

    const flatListRef = useRef();

  return (
    <FlatList
    initialNumToRender={10}
    bg="darkBlue.800"
    data={messages}
    ref={flatListRef}
    // getItemLayout={(data, index) => (
    //   {length: 30, offset: 30 * index, index}
    // )}
    // initialScrollIndex = {messages.length - 1}
    inverted={1}
    // onContentSizeChange={() =>
    //   flatListRef.current.scrollToEnd({ animated: true })
    // }
    renderItem={({ item, index }) => (
      <Message
        highlighted={highlighted}
        highlight={highlight}
        onReply={onReply}
        messageId={item?.id}
        index={index}
        chatId={chatId}
        data={item?.data}
        messagesCount={messagesCount}
        flatListRef={flatListRef}
      />
    )}
    keyExtractor={(item) => item.id}
  />
  )
})

export default Messages