import React, { useId } from 'react'
import { SafeAreaView } from 'react-native'
import { Text, Button, Center } from 'native-base'
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const GameLobby = ({createNewGame}) => {

    const newGame = (gameType) => {
        console.log("let's play ", gameType)

        //pass to chatScreen, chat scrreen adds game type to message with initial state
        switch(gameType) {
            case "rock-paper-scissors":
              // code block
            createNewGame(gameType, {
                players: [auth?.currentUser?.uid, null],
                selections: [0, 0],
                gameOver: false,
                winner: ""
            });
              break;
            case "quarto":
                createNewGame(gameType, {
                    players: [auth?.currentUser.uid, null],
                    board: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
                    availablePieces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                    chosenPiece: null,
                    currTurn: 0,
                    gameOver: false,
                    winner: ""
                });
              break;
              case "tic-tac-toe":
                createNewGame(gameType, {
                    players: [auth?.currentUser.uid, null],
                    board: ["", "", "", "", "", "", "", "", ""],
                    currTurn: 0,
                    gameOver: false,
                    winner: ""
                });
              break;
              case "quoridor":
                createNewGame(gameType, {
                    players: [auth?.currentUser.uid, null],
                    pawns: [4,76],
                    board: Array(81).fill({right: false, left: false, top: false, bottom: false}),
                    pieceLocations: [],
                    currTurn: 0,
                    gameOver: false,
                    winner: ""
                });
              break;
            default:
              // code block
              break;
          }

    }


  return (
    <SafeAreaView>
        <Center>
        <Text> Game Lobby </Text>
        {/* TODO: change to list */}
        <Button onPress={() => {newGame("rock-paper-scissors")}}> Play rock paper scissors </Button>
        <Button onPress={() => {newGame("quarto")}}> Play Quarto </Button>
        <Button onPress={() => {newGame("tic-tac-toe")}}> Play Tic Tac Toe </Button>
        <Button onPress={() => {newGame("quoridor")}}> Play Quoridor </Button>
        </Center>
    </SafeAreaView>
  )
}

export default GameLobby