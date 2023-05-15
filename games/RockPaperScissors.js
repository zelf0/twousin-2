import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Radio,
  Icon,
  HStack,
  IconButton,
  Text,
  Heading,
  VStack
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "../db";
import { FAMILY_TOKEN } from "../services/family-module";
import getNameFromUserId from "../services/getNameFromUserId";

const RockPaperScissors = ({ chatId, messageId }) => {
  // state schema:
  // {
  //     players : [uid, uid],
  //     selections: [int, int]
  // }
  const auth = getAuth();
  const [selected, setSelected] = useState(0);
  // const [updatedGameState, setUpdatedGameState] = useState(undefined);
  const [selections, setSelections] = useState(undefined);
  // const [updatedPlayers, setUpdatedPlayers] = useState(undefined);
  const [gameOver, setGameOver] = useState(undefined);
  const [winner, setWinner] = useState(undefined);
  const [updates, setUpdates] = useState(0);
  const [gameState, setGameState] = useState(null);


  useEffect(() => {
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


  // useEffect(() => {
    // console.log("he");
    // console.log(updatedPlayers, gameOver, winner, selections);
    // if (
    //   selections === undefined ||
    //   updatedPlayers === undefined ||
    //   gameOver === undefined ||
    //   winner === undefined
    // ) {
    //   return;
    // }
    console.log("ok we're in biz");
    //   setUpdatedGameState({players: updatedPlayers, selections: selections, gameOver: gameOver, winner: winner})
    // setUpdates(updates + 1);
    // console.log("UPDATES COUNTER ", updates);
    // const updateDatabase = async () => {
    //   try {
    //     await updateDoc(doc(db, "families", 
    //     FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
    //       timestamp: new Date().toISOString(),
    //       gameState: {
    //         players: updatedPlayers,
    //         selections: selections,
    //         gameOver: gameOver,
    //         winner: winner,
    //       },
    //     });
    //   } catch (e) {
    //     console.error("Error adding document: ", e);
    //     alert("Error adding document: ", e);
    //   }
    // };

    // updateDatabase();
    // return () => {
    //   // setUpdates(0);
    // };
  // }, [updatedPlayers, selections, gameOver, winner]);

  // useEffect(() => {
  //     if (updatedPlayers === undefined) { return }
  //     const updateDatabase = async() => {
  //     try {
  //         await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
  //           timestamp: new Date().toISOString(),
  //           gameState: {players: updatedPlayers, selections: selections, gameOver: gameOver, winner: winner},
  //         });
  //       } catch (e) {
  //         console.error("Error adding document: ", e);
  //         alert("Error adding document: ", e);
  //       }
  //     }
  //     updateDatabase();

  //   //TODO: this unnecessarily talks to the database multiple times, maybe some kind of check?
  // }, [updatedGameState])

  const sendMove = async () => {
    let updatedPlayers = [];
    //update the game state
    console.log(gameState);
    let playerIndex = gameState?.players?.indexOf(auth.currentUser.uid);
    //check if player is in the game already
    if (playerIndex < 0) {
      //return if game is already full
      if (gameState?.players[0] && gameState?.players[1]) {
        return;
      }
      //if it's not full, add player to the game
      for (let i = 0; i < gameState?.players?.length; i++) {
        if (!gameState.players[i]) {
          updatedPlayers = gameState.players;
          updatedPlayers[i] = auth.currentUser.uid;
          // console.log(updatedPlayers);
          // setUpdatedPlayers(updatedPlayersTemp);
          // console.log(updatedPlayers);
          playerIndex = i;
        }
      }
    }
    //if the're alread in the game, no need to update, so just set updated players to what it was before
    else {
      updatedPlayers = gameState.players;
    }
    console.log("player index", playerIndex);
    const updatedSelections = gameState.selections;
    updatedSelections[playerIndex] = selected;
    // setSelections(updatedSelections);
    if (updatedSelections[0] && updatedSelections[1]) {
      //both selections are made, so calculate results
      setWinner(calculateWinner(updatedSelections));
      setGameOver(true);
      console.log("game is over", gameOver, winner);
    } else {
      setGameOver(false);
      setWinner("");
    }


    try {
          await updateDoc(doc(db, "families", 
          FAMILY_TOKEN, "chats", chatId, "messages", messageId), {
            senderId: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            timestamp: new Date().toISOString(),
            gameState: {
              players: updatedPlayers,
              selections: updatedSelections,
              gameOver: (updatedSelections[0] && updatedSelections[1]),
              winner: calculateWinner(updatedSelections),
            },
          });
        } catch (e) {
          console.error("Error adding document: ", e);
          alert("Error adding document: ", e);
        }
        
  };

  const calculateWinner = (selections) => {
    //if draw
    if (selections[0] === selections[1]) {
      return "It's a tie";
    }
    //if first player wins
    if (
      selections[0] - selections[1] === 1 ||
      selections[0] - selections[1] === -2
    ) {
      return gameState.players[0];
    }
    return gameState.players[1];
  };
  return (
    <Box>
      <Text> Rock, Paper, Scissors {selected} </Text>
      {gameState?.gameOver ? (
          <Heading
            mt="1/3"
            borderWidth={3}
            borderColor="primary.400"
            textAlign
            color="primary.400"
            bg="black:alpha.50"
            size="4xl"
          >
           {gameState.winner === auth.currentUser.uid ? "You win" : `${getNameFromUserId(gameState.winner)} wins`}
          </Heading>
      ) : (
        <></>
      )}
      <HStack alignItems="center">
        <IconButton
          key={1}
          variant={selected === 1 ? "outline" : "ghost"}
          icon={<Icon as={FontAwesome5} name="hand-rock" />}
          colorScheme="green"
          onPress={() => {
            setSelected(1);
          }}
        />
        <IconButton
          key={2}
          variant={selected === 2 ? "outline" : "ghost"}
          icon={<Icon as={FontAwesome5} name="hand-paper" />}
          colorScheme="green"
          onPress={() => {
            setSelected(2);
          }}
        />
        <IconButton
          key={3}
          variant={selected === 3 ? "outline" : "ghost"}
          icon={<Icon as={FontAwesome5} name="hand-scissors" />}
          colorScheme="green"
          onPress={() => {
            setSelected(3);
          }}
        />
      </HStack>
      <Button onPress={sendMove} isDisabled={!selected}>
        Shoot
      </Button>
      <HStack>
        <VStack>
            <Text> P1 </Text>
            {gameState?.gameOver ? <Icon size="4xl" as={FontAwesome5} name={["hand-rock", "hand-paper", "hand-scissors"][gameState.selections[0] - 1]}/> : <Icon size="4xl" as={FontAwesome5} name="question" />}
        </VStack>
        <VStack>
            <Text> P2 </Text>
            {gameState?.gameOver ? <Icon size="4xl" as={FontAwesome5} name={["hand-rock", "hand-paper", "hand-scissors"][gameState.selections[1] - 1]}/> : <Icon size="4xl" as={FontAwesome5} name="question" />}
        </VStack>
      </HStack>
    </Box>
  );
};

export default RockPaperScissors;
