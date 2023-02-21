import React from 'react'
import { Input, Icon, HStack } from 'native-base';
import {
    Ionicons,
    MaterialIcons,
  } from "@expo/vector-icons";
import { useState } from 'react';

const ChatInput = ({onSendMessage, onAddMedia, onOpenGameLobby}) => {

    const [input, setInput] = useState("");

    const sendMessageCallback = () => {

        onSendMessage(input);

        setInput("");
    }
 

  return (
    <Input
            placeholder="Message"
            value={input}
            //TODO: send message on enter
            onChangeText={(text) => setInput(text)}
            InputLeftElement={
              <HStack>
                <Icon
                  as={<MaterialIcons name="add" />}
                  key={1}
                  size={10}
                  mr="2"
                  color="primary.400"
                  onPress={onAddMedia}
                />
                <Icon
                  as={<MaterialIcons name="sports-esports" />}
                  key={2}
                  size={10}
                  mr="2"
                  color="primary.400"
                  onPress={onOpenGameLobby}
                />
              </HStack>
            }
            InputRightElement={
              <Icon
                as={<Ionicons name="send" />}
                size={8}
                mr="2"
                color="primary.400"
                onPress={sendMessageCallback}
              />
            }
          />
  )
}

export default ChatInput