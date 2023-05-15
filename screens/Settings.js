import { Box, Button, Input, Text } from 'native-base'
import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import { getAuth, signOut, updateProfile } from "firebase/auth";

const auth = getAuth();

const Settings = ({navigation}) => {

  const [input, setInput] = useState("");


  const logout = () => {
    signOut(auth).then(() => {
      console.log("signed out")
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  const updateDisplayName = () => {
    updateProfile(auth.currentUser, {
      displayName: input
    }).then(() => {
      // Profile updated!
      // ...ß
    }).catch((error) => {
      alert(error);
      // An error occurred
      // ...
    });
    
  }
 
  return (
    <Box> 
      <Text> Settings </Text> 
      <Text> Version 4/19/23 6:48 PM </Text>

      {/* TODO: this should be its own componenet or service */}
      <Button onPress={logout}> Log Out </Button> 
      <Input
        placeholder="edit display name"
        value={input}
        onChangeText={(text) => setInput(text)}
      />
      <Button title="update display name" onPress={updateDisplayName}>
        update display name
      </Button>

    </Box>
  )
}

export default Settings