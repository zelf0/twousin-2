import React, { useState } from 'react'
import { Modal, Box, Pressable, Center, Text, ScrollView } from 'native-base'
import GameStage from './GameStage';
import VirtualizedScrollView from './VirtualizedScrollView';
 
const GameMessage = ({self, gameState, gameType, chatId, messageId}) => {

    const [gameStageOpen, setGameStageOpen] = useState(false);
  return (
    <Box>
    <Modal isOpen={gameStageOpen} onClose={setGameStageOpen} size="full">
        <Modal.Content h="90%">
          <VirtualizedScrollView>
        <GameStage chatId={chatId} messageId={messageId} gameState={gameState} gameType={gameType}/>
        </VirtualizedScrollView>
        </Modal.Content>
    </Modal>
    {/* <Box m={2} alignItems = {self ? "flex-end" : "flex-start"}>
    <Center p={3} borderRadius={20} maxW="55%" minW="20%" bgColor={self ? "primary.500" : "white"}> */}
    <Pressable onPress = {() => setGameStageOpen(true)} m={2} alignItems = {self ? "flex-end" : "flex-start"}>
        <Text borderRadius={5} borderWidth={1} p={5} > Play {gameType}</Text>
    </Pressable>
    {/* </Center>
    </Box> */}
    </Box>
  )
}

export default GameMessage