import React from "react";
import {
  Square,
  Box,
  Text,
  HStack,
  Button,
  VStack,
  FlatList,
  Icon,
  IconButton,
  Image,
  Pressable,
  Center,
  Heading,
} from "native-base";

// import { Image } from 'react-native';
import { useState, useLayoutEffect, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "../db";
import { FAMILY_TOKEN } from "../services/family-module";
// import Award from './src/assets/images/award.svg';

const auth = getAuth();

// Initial State:  {
//     players: [auth?.currentUser.uid, null],
//     board: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
//     availablePieces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
//     chosenPiece: null,
//     currTurn: 0,
//     gameOver: false,
//     winner: ""
// }

const Quarto = ({ chatId, messageId }) => {
  const pieces = [
    {
      traits: [0, 0, 0, 0],
      icon: require("../assets/quarto-pieces/light-yellow-holy-circle.png"),
    },
    {
      traits: [0, 0, 0, 1],
      icon: require("../assets/quarto-pieces/light-yellow-holy-square.png"),
    },
    {
      traits: [0, 0, 1, 0],
      icon: require("../assets/quarto-pieces/light-yellow-unholy-circle.png"),
    },
    {
      traits: [0, 0, 1, 1],
      icon: require("../assets/quarto-pieces/light-yellow-unholy-square.png"),
    },
    {
      traits: [0, 1, 0, 0],
      icon: require("../assets/quarto-pieces/light-blue-holy-circle.png"),
    },
    {
      traits: [0, 1, 0, 1],
      icon: require("../assets/quarto-pieces/light-blue-holy-square.png"),
    },
    {
      traits: [0, 1, 1, 0],
      icon: require("../assets/quarto-pieces/light-blue-unholy-circle.png"),
    },
    {
      traits: [0, 1, 1, 1],
      icon: require("../assets/quarto-pieces/light-blue-unholy-square.png"),
    },
    {
      traits: [1, 0, 0, 0],
      icon: require("../assets/quarto-pieces/dark-yellow-holy-circle.png"),
    },
    {
      traits: [1, 0, 0, 1],
      icon: require("../assets/quarto-pieces/dark-yellow-holy-square.png"),
    },
    {
      traits: [1, 0, 1, 0],
      icon: require("../assets/quarto-pieces/dark-yellow-unholy-circle.png"),
    },
    {
      traits: [1, 0, 1, 1],
      icon: require("../assets/quarto-pieces/dark-yellow-unholy-square.png"),
    },
    {
      traits: [1, 1, 0, 0],
      icon: require("../assets/quarto-pieces/dark-blue-holy-circle.png"),
    },
    {
      traits: [1, 1, 0, 1],
      icon: require("../assets/quarto-pieces/dark-blue-holy-square.png"),
    },
    {
      traits: [1, 1, 1, 0],
      icon: require("../assets/quarto-pieces/dark-blue-unholy-circle.png"),
    },
    {
      traits: [1, 1, 1, 1],
      icon: require("../assets/quarto-pieces/dark-blue-unholy-square.png"),
    },
  ];

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
  const [nextChosenPiece, setNextChosenPiece] = useState(null);
  const [placed, setPlaced] = useState(false);

  const choosePiece = (piece) => {
    setNextChosenPiece(piece);
  };

  const chooseSquare = (square) => {
    setChosenSquare(square);
  };

  const lockPlacement = () => {
    setPlaced(true);
    checkWin();
  }

  const checkWin = () => {
    //put board into a 2D array
    const newBoard = gameState.board.map((elem, idx) =>
    idx == chosenSquare ? gameState.chosenPiece : elem
  );
    const boardArray = [];
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        row.push(newBoard[i * 4 + j]);
      }
      boardArray.push(row);
    }
    //check rows, columns diagonals
    //for each iteration, check the kth property and see if they're all the same
    const x = Math.floor(chosenSquare / 4);
    const y = chosenSquare % 4;
  

    //check row
      checkMatch([...boardArray[x]]);
    
    // check column
      checkMatch([boardArray[0][y], boardArray[1][y], boardArray[2][y], boardArray[3][y]]);
    //check diagonal
    if (x === y) {
      checkMatch([boardArray[0][0], boardArray[1][1], boardArray[2][2], boardArray[3][3]]);
    }
    else if (x + y === 3) {
      checkMatch([boardArray[0][3], boardArray[1][2], boardArray[2][1], boardArray[3][0]]);
    }
    
    return false;
  }

  const checkMatch = (piecesArray) => {
    if (piecesArray.some(e => e === 100)) {
      return;
    }
    console.log("full row");
    for (let k = 0; k < 4; k++) {
      const traitsArray = piecesArray.map(e => pieces[e - 1].traits[k]);
      if (traitsArray.every(e => e == traitsArray[0])) {
        endGame();
      }
    }
  }

  const sendMove = async () => {
    if (!gameState) {
      return;
    }
    const changedCurrTurn = !!gameState.currTurn ? 0 : 1;
    const changedBoard = gameState.board.map((elem, idx) =>
      idx == chosenSquare ? gameState.chosenPiece : elem
    );
    const changedAvailablePieces = gameState.availablePieces.filter(
      (e) => e != nextChosenPiece
    );
    try {
      await updateDoc(doc(db, "families", 
      FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
        //TODO: deprecate display name
        senderId: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        timestamp: new Date().toISOString(),
        gameState: {
          players: gameState.players,
          board: changedBoard,
          availablePieces: changedAvailablePieces,
          chosenPiece: nextChosenPiece,
          currTurn: changedCurrTurn,
          gameOver: gameState.gameOver,
          winner: gameState.winner,
        },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
    setChosenSquare(null);
    setNextChosenPiece(null);
    setPlaced(false);
  };

  const joinGame = async () => {
    //only continue if second player is currently null because it's a two player game
    if (gameState.players[1]) {
      return;
    }
    if (!gameState) {
      return;
    }
    try {
      await updateDoc(doc(db, "families", 
      FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
        timestamp: new Date().toISOString(),
        gameState: {
          players: [gameState.players[0], auth.currentUser.uid],
          board: gameState.board,
          availablePieces: gameState.availablePieces,
          chosenPiece: gameState.chosenPiece,
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



  const endGame = async () => {

     const changedBoard = gameState.board.map((elem, idx) =>
      idx == chosenSquare ? gameState.chosenPiece : elem
    );
    try {
      await updateDoc(doc(db, "families", 
      FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
        timestamp: new Date().toISOString(),
        gameState: {
          players: gameState.players,
          board: changedBoard,
          availablePieces: gameState.availablePieces,
          chosenPiece: gameState.chosenPiece,
          currTurn: gameState.currTurn,
          gameOver: true,
          winner: gameState.currTurn,
        },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding document: ", e);
    }
  };
  return (
    <Center>
       {!gameState?.players.includes(auth.currentUser.uid) &&
        !gameState?.players[gameState.players?.length] ? (
          <Button zIndex={4} onPress={joinGame}> Join Game </Button>
        ) : (
          <></>
        )}
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
           {gameState.players[gameState.winner] === auth.currentUser.uid ? "You win" : "Opponent wins"}
          </Heading>
        </Box>
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
      <Box>
        <Text>Quarto</Text>
        {gameState?.chosenPiece && chosenSquare === null ? (
          <HStack>
            <Text m="2"> Your opponent gave you this piece: </Text>
            <Image
              key={gameState?.chosenPiece}
              style={{
                width: 70,
                height: 70,
                // resizeMode: "center",
              }}
              alt="Alt Text"
              source={pieces[gameState?.chosenPiece - 1]?.icon}
            />
          </HStack>
        ) : (
          <> </>
        )}
      </Box>
      <FlatList
         listKey={(item, index) => `_key${index.toString()}`}
         keyExtractor={(item, index) => `_key${index.toString()}`}
        data={gameState?.board}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            isDisabled={placed || !gameState?.chosenPiece || item != 100}
            opacity={(placed || !gameState?.chosenPiece) ? "50" : "100"}
            onPress={() => {
              chooseSquare(index);
            }}
          >
            <Square
              size={20}
              bg="dark.700"
              borderWidth={1}
              borderColor="dark.100"
            >
              {item == 100 ? (
                index == chosenSquare ? (
                  <Image
                    borderWidth={9}
                    borderColor="green.300"
                    size="xs"
                    style={{
                      width: 70,
                      height: 70,
                      // resizeMode: "center",
                    }}
                    alt="Alt text"
                    source={pieces[gameState?.chosenPiece - 1].icon}
                  />
                ) : (
                  <> </>
                )
              ) : (
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    // resizeMode: "stretch",
                  }}
                  alt="Alt Text"
                  source={pieces[item - 1]?.icon}
                />
              )}
            </Square>
          </Pressable>
        )}
        numColumns={4}
      />
       <Button
       display={(placed || !gameState?.chosenPiece) ? "none" : "block"}
        w="full"
        isDisabled={
          placed ||
          !gameState?.chosenPiece ||
          (chosenSquare === null)
        }
        onPress={lockPlacement}
      >
        Confirm Placement
      </Button>
      <Heading display = {gameState?.chosenPiece!== null && !placed ? "none" : "block"}> Select piece for Opponent </Heading>
      <FlatList
        keyExtractor={(item) => item}
        // key="1"
        listKey={(item) => item}
        // cellKey="1"
        data={gameState?.availablePieces}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            isDisabled={gameState?.chosenPiece !== null && !placed}
            _disabled={{
              opacity: 50,
            }}
            onPress={() => {
              choosePiece(item);
            }}
          >
                <Box
                  borderRadius="5"
                  p="2"
                  mt={item == nextChosenPiece ? "-1" : "0"}
                  bg={item == nextChosenPiece ? "green.100" : "transparent"}
                >
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      // resizeMode: "stretch",
                    }}
                    alt="Alt Text"
                    source={pieces[item - 1]?.icon}
                  />
                </Box>
          </Pressable>
        )}
        numColumns={6}
      />
      <Button
        display = {gameState?.chosenPiece !== null && !placed ? "none" : "block"}
        w="full"
        isDisabled={
          nextChosenPiece === null ||
          (gameState.chosenPiece && chosenSquare === null)
        }
        onPress={sendMove}
      >
        Confirm Piece Selection
      </Button>
    </Center>
  );
};

export default Quarto;
