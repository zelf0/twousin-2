import React, { useState } from 'react'
import { Modal, Box, Pressable, Center, Text } from 'native-base'
import GameStage from './GameStage';
 
const GameMessage = ({self, gameState, gameType, chatId, messageId}) => {

    const [gameStageOpen, setGameStageOpen] = useState(false);
  return (
    <Box>
    <Modal isOpen={gameStageOpen} onClose={setGameStageOpen} size="full">
        <Modal.Content h="90%">
        <GameStage chatId={chatId} messageId={messageId} gameState={gameState} gameType={gameType}/>
        </Modal.Content>
    </Modal>
    <Pressable onPress = {() => setGameStageOpen(true)} m={2} alignItems = {self ? "flex-end" : "flex-start"}>
    <Center maxW="55%" minW="20%" bgColor={self ? "primary.500" : "white"}>
        <Text>{gameType}</Text>
    </Center>
    </Pressable>
    </Box>
  )
}

export default GameMessage