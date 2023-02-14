import React from "react";
import {
  Box,
  Center,
  Fab,
  HStack,
  Icon,
  NativeBaseConfigProvider,
  NativeBaseProvider,
  Text,
} from "native-base";
import { Pressable } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
// import { NativeBaseConfigProvider } from 'native-base/lib/typescript/core/NativeBaseContext';

const BottomNav = ({ navigation, stackNavigation }) => {
  const [selected, setSelected] = React.useState(1);
  const buttoncolor = "#0891b2"
  // const buttoncolor = "darkblue"
  return (
      <Box  bg = "primary.350" 
      // position="fixed"
      bottom={3}>
    <HStack
      width="100%"
      space={0}
      justifyContent="center"
    >
      <Center h="20" w="20" rounded="md" shadow={3}>
        <Pressable
          justifyContent = "center"
          onPress={() => {
            setSelected(1);
            navigation.navigate("Feed"); 
          }}
        >
          <Ionicons name="home" size={28} color={selected === 1 ?  buttoncolor : "#f2edf2"}/>
          <Text> Feed </Text>
        </Pressable>
      </Center>
      <Center bg = "green"  h="20" w="20" rounded="md" shadow={3}>
        <Pressable  justifyContent = "center" onPress={() => {
            setSelected(2);
            navigation.navigate("Notifications"); 
          }}>
          <Ionicons name="notifications" size={28} color={selected === 2 ?  buttoncolor : "#f2edf2"}/>
          <Text> Notifs </Text>
        </Pressable>
      </Center>
      <Center bg = "green" h="20" w="20" rounded="md" shadow={3}>
        <Fab
          renderInPortal={false}
          bgColor = {buttoncolor}
          // shadow={2}
          size={70}
          icon={<Ionicons color = "white" name="add" size = {28}/>}
          onPress={() => {
            setSelected(5);
            navigation.navigate("Create Post"); 
          }}
        />
      </Center>
      <Center h="20" w="20" rounded="md" shadow={3} >
      <Pressable
          justifyContent = "center"
          onPress={() => {
            setSelected(3);
            navigation.navigate("Lobby", {stackNavigation: stackNavigation}); 
            // navigation.navigate("Lobby"); 
          
          }}
        >
          <Ionicons name="chatbubble" size={28} color={selected === 3 ? buttoncolor : "#f2edf2"}/>
          <Text> Chat </Text>
        </Pressable>
      </Center>
      <Center h="20" w="20" rounded="md" shadow={3}>
      <Pressable
          justifyContent = "center"
          onPress={() => {
            setSelected(4);
            navigation.navigate("Settings"); 
          }}
        >
          <Ionicons name="settings" size={28} color={selected === 4 ?  buttoncolor : "#f2edf2"} />
          <Text> Settings </Text>
        </Pressable>
      </Center>
    </HStack>
    </Box>
  );
};

export default BottomNav;
