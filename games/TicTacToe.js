import { Text, Center, Square, FlatList, Pressable, Button, Box, Heading} from 'native-base'
import React, { useLayoutEffect, useState } from 'react'
import { getAuth } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "../db";
import { FAMILY_TOKEN } from "../services/family-module";
const auth = getAuth();

const TicTacToe = ({ chatId, messageId }) => {

    const [gameState, setGameState] = useState(null);

    useLayoutEffect(() => {
      const unsubscribe = onSnapshot(
        doc(db, "families", 
        FAMILY_TOKEN, "chats", chatId, "messages", messageId),
        (doc) => {
          setGameState(doc.data().gameState);
        },
        (error) => {
          console.error(error);
        }
      );
      return unsubscribe;
    }, []);

const [chosenSquare, setChosenSquare] = useState(null);

  const chooseSquare = (square) => {
    console.log(square);
    setChosenSquare(square);
  };

  const getCurrentLetter = () => {
    return (gameState?.currTurn === 0 ? "X" : "O");
  }

  const joinGame = async () => {
    //only continue if second player is currently null because it's a two player game
    if (gameState.players[1]) {
      return;
    }
    if (!gameState) {
      return;
    }
    //TODO:
    //here is the deal i just realized instead of copying and pasting everything and modifying it for every game,
    // there should be functions that every game uses and a module that gets the schema for the game statee of each game
    try {
      await updateDoc(doc(db, "families", 
      FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
        timestamp: new Date().toISOString(),
        gameState: {
          players: [gameState.players[0], auth.currentUser.uid],
          board: gameState.board,
          currTurn: gameState.currTurn,
          gameOver: gameState.gameOver,
          winner: gameState.winner,
        },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
  };


  const sendMove = async () => {
    if (!gameState) {
      return;
    }
    const changedCurrTurn = !!gameState.currTurn ? 0 : 1;
    // update board
    const changedBoard = gameState.board.map((elem, idx) => idx == chosenSquare ? getCurrentLetter() : elem)
    const updatedWinner = checkWin(changedBoard) ? gameState.players[gameState.currTurn] : gameState.winner;
    try {
      await updateDoc(doc(db, "families", 
      FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
        senderId: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        timestamp: new Date().toISOString(),
        gameState: {
          players: gameState.players,
          board: changedBoard,
          currTurn: changedCurrTurn,
          gameOver: !!updatedWinner,
          winner: updatedWinner,
        },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
    setChosenSquare(null);
  };

  const checkWin = (board) => {
    const boardArray = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(board[i * 3 + j]);
      }
      boardArray.push(row);
    }
    console.log(boardArray)
    const x = Math.floor(chosenSquare / 3);
    const y = chosenSquare % 3;
    console.log(x, y)
    
    //check row
    if (checkMatch([...boardArray[x]])) { return true};
    
    // check column
      if (checkMatch([boardArray[0][y], boardArray[1][y], boardArray[2][y]])) { return true};
    //check diagonal
    if (x === y) {
      if (checkMatch([boardArray[0][0], boardArray[1][1], boardArray[2][2]])) { return true };
    }
    else if (x + y === 2) {
      if (checkMatch([boardArray[0][2], boardArray[1][1], boardArray[2][0]])) { return true};
    }
    
    return false;
  }
  const checkMatch = (array) => {
    if (array.some(e => e === "")) {
      return;
    }
    console.log("full row", array);
    if (array[0] === array[1] && array[1] === array[2]) {
        console.log("game over tic tac toe")
       return true;
    }
  }
  return (
    <Center>
    <Text> Tic Tac Toe </Text>
    {gameState?.gameOver ? (
        <Box w="full" h="full" position="absolute" zIndex={3}>
          <Box
            opacity={30}
            position="absolute"
            bg="gray.700"
            w="full"
            h="full"
          ></Box>
          <Heading
            mt="1/3"
            borderWidth={3}
            borderColor="primary.400"
            textAlign
            color="primary.400"
            bg="black:alpha.50"
            size="4xl"
          >
           {gameState.winner === auth.currentUser.uid ? "You win" : "Opponent wins"}
          </Heading>
        </Box>
      ) : (
        <></>
      )}
    {!gameState?.players.includes(auth.currentUser.uid) &&
        !gameState?.players[gameState.players?.length] ? (
          <Button zIndex={4} onPress={joinGame}> Join Game </Button>
        ) : (
          <></>
        )}
    {auth.currentUser.uid !== gameState?.players[gameState?.currTurn] && !gameState?.gameOver ? (
        <Box w="full" h="full" position="absolute" zIndex={2}>
          <Box
            opacity={60}
            position="absolute"
            bg="gray.700"
            w="full"
            h="full"
          ></Box>
          <Heading
            mt="1/3"
            borderWidth={3}
            borderColor="primary.400"
            textAlign
            color="primary.400"
            bg="black:alpha.70"
            size="4xl"
          >
            Waiting for opponent
          </Heading>
        </Box>
      ) : (
        <Heading> Your turn </Heading>
      )}
    <FlatList
    numColumns={3}
    data={gameState?.board}
    renderItem={({ item, index }) => (
        <Pressable  onPress={() => {
            chooseSquare(index);
          }} isDisabled={item !== ""}>
        <Square
        size={20}
        bg="dark.700"
        borderWidth={1}
        borderColor="dark.100"
      >
        {index === chosenSquare ? <Text color="red.700"> {getCurrentLetter()} </Text> :  <Text> {gameState?.board[index]} </Text>}
    </Square>
      </Pressable>
    )}
    // keyExtractor={(item) => item.id}
  />
  <Button isDisabled={chosenSquare === null} onPress={sendMove}> Send </Button>
</Center>
  )
}

export default TicTacToe