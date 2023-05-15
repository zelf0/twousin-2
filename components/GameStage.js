import React from 'react'
import { Box, Text } from 'native-base'
import RockPaperScissors from '../games/RockPaperScissors';
import Quarto from '../games/Quarto';
import TicTacToe from '../games/TicTacToe';
import Quoridor from '../games/Quoridor';

const GameStage = ({gameType, gameState, chatId, messageId}) => {
  //TODO: this switch stattement does not actually make sensee i don't thhink
    switch(gameType) {
        case "rock-paper-scissors":
          return <RockPaperScissors chatId={chatId} messageId={messageId} gameState={gameState} />
          break;
        case "quarto":
            return <Quarto chatId={chatId} messageId={messageId} gameState={gameState}/>
          break;
          case "tic-tac-toe":
            return <TicTacToe chatId={chatId} messageId={messageId} gameState={gameState}/>
          break;
          case "quoridor":
            return <Quoridor chatId={chatId} messageId={messageId} gameState={gameState}/>
          break;
        case "poll":
            return <Poll post={post}/>
            break;
        case "short": 
            return <ShortPost post={post}/>
            break;
        default:
          return <Text> Invalid game</Text>
      }
}

export default GameStage