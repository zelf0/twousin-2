import {
  Text,
  Center,
  Square,
  FlatList,
  Pressable,
  Button,
  Box,
  Heading,
  HStack,
  VStack,
} from "native-base";
import React, { useLayoutEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import db from "../db";
import { FAMILY_TOKEN } from "../services/family-module";
const auth = getAuth();

const Quoridor = ({ chatId, messageId }) => {
  const [gameState, setGameState] = useState(null);
  const [board, setBoard] = useState([[{bottom: false, right: false}, {bottom: false, right: false}], [{bottom: false, right: false}, {bottom: false, right: false}]]);
  const [wallHorizontal, setWallHorizontal] = useState(true);
  const [pawns, setPawns] = useState([null, null]);

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "families", FAMILY_TOKEN, "chats", chatId, "messages", messageId),
      (doc) => {
        setGameState(doc.data().gameState);
        setBoard(doc.data().gameState.board);
        setPawns(doc.data().gameState?.pawns);
        // const gameBoard = doc.data().gameState.board;
        //acutally no, we're using 1d array and linear indexing because the 2d array makes it harder to map and it doesn't actually make the functionality better
        // const boardArray = [];
        // //populate boardArray as a 2D array from gameState 1D array
        // for (let i = 0; i < 9; i++) {
        //   const row = [];
        //   for (let j = 0; j < 9; j++) {
        //     console.log(gameBoard[i * 9 + j])
        //     row.push(gameBoard[i * 9 + j]);
        //   }
        //   boardArray.push(row);
        // }
        // setBoard(boardArray);
        console.log("board", board);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }, []);

  const selectWall = (selectedIndex) => {
    console.log(selectedIndex);
    if (wallHorizontal) {
      setBoard(
        board.map((elem, idx) =>
          idx === selectedIndex ? { bottom: true, right: elem.right } : elem
        )
      );
    } else {
      setBoard(
        board.map((elem, idx) =>
          idx === selectedIndex ? { bottom: elem.bottom, right: true } : elem
        )
      );
    }
    // console.log("board", board);
  };

  const toggleRotation = () => {
    //if wall rotation is horizontal, set to vertical, else horizontal
    setWallHorizontal(wallHorizontal ? false : true);
  };

  return (
    <Center p={5}>
      {/* board if we use a 2d array */}
      {/* {board.map((row, rowIdx) => (
        <HStack key={rowIdx}>
          {row.map((cell, idx) => (
            <Square size={8} key={idx}   position="relative"
            borderRightWidth={5}
            borderBottomWidth={5}
            borderLeftWidth={0}
            borderTopWidth={0}
            zIndex={1}
            borderRightColor={cell?.right ? "amber.500" : "dark.500"}
            // borderTopColor={item.top ? "amber.500" : "dark.500"}
            borderBottomColor={cell?.bottom ? "amber.500" : "dark.500"}>
                    {wallHorizontal ? (
              <Pressable
                bgColor="red.100"
                position="absolute"
                top={4}
                zIndex={2}
                onPress={() => {
                  selectWall(cell?.id);
                }}
                w={8}
                h={8}
                opacity={cell?.bottom ? 40 : 80}
                borderWidth={0}
              ></Pressable>
            ) : (
              <Pressable
              bgColor="red.100"
                position="absolute"
                left={4}
                zIndex={2}
                onPress={() => {
                  selectWall(cell?.id);
                }}
                w={8}
                h={8}
                opacity={cell?.right ? 40 : 80}
                borderWidth={0}
              ></Pressable>
            )}
            </Square>
          ))}
        </HStack>
      ))} */}
      <FlatList
        numColumns={9}
        data={board}
        renderItem={({ item, index }) => (
          // <Square position="relative">
            <Square
              position="relative"
              size={8}
              borderRightWidth={5}
              borderBottomWidth={5}
              borderLeftWidth={0}
              borderTopWidth={0}
              zIndex={1}
              // borderColor="dark.500"
              // borderLeftColor={item.left ? "amber.500" : "dark.500"}
              borderRightColor={item.right ? "amber.500" : "dark.500"}
              // borderTopColor={item.top ? "amber.500" : "dark.500"}
              borderBottomColor={item.bottom ? "amber.500" : "dark.500"}
              bgColor={pawns ? pawns.includes(index) ? "primary.500" : "white" : "white"}
            >
              {/* <Pressable onPress={() => {selectWall(index, "bottom")}} w={8} h={4} bgColor="red.500"></Pressable> */}
            {/* </Square> */}
            {wallHorizontal ? (
              <VStack> 
                <Pressable w={8} h={4} onPress={() => {
                  selectWall(index - 9);
                }}></Pressable>
                <Pressable w={8} h={4} onPress={() => {
                  selectWall(index);
                }}></Pressable>
              </VStack>
              // <Pressable
              //   position="absolute"
              //   top={4}
              //   zIndex={2}
              //   onPress={() => {
              //     selectWall(index);
              //   }}
              //   w={8}
              //   h={8}
              //   opacity={item.bottom ? 40 : 80}
              //   borderWidth={0}
              //   bgColor="red.500"
              // ></Pressable>
            ) : (
              <HStack> 
              <Pressable opacity={50} w={4} h={8} onPress={() => {
                selectWall(index - 1);
              }}></Pressable>
              <Pressable opacity={50} w={4} h={8} onPress={() => {
                selectWall(index);
              }}></Pressable>
            </HStack>
            )}
          </Square>
        )}
      />
      <HStack mt={4}>
        <Button onPress={toggleRotation}> Rotate </Button>
        <Square ml={3} size={8}>
          <Box
            bgColor="amber.500"
            h={wallHorizontal ? 1 : 8}
            w={wallHorizontal ? 8 : 1}
          />
        </Square>
      </HStack>
    </Center>
  );
};

export default Quoridor;
