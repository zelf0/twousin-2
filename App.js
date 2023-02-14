import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { NativeBaseProvider } from 'native-base';
import { useState, useEffect } from 'react';
import TabNavigation from './components/TabNavigation';
import ChatScreen from './screens/ChatScreen';
import CreateChatScreen from './screens/CreateChatScreen';
import LoginForm from './screens/LoginForm';
import SignUpForm from './screens/SignUpForm';
import { View, Text } from "native-base";

const Stack = createNativeStackNavigator();


function App() {

  
  

  const auth = getAuth();
  const user = auth.currentUser;
  
  const [loggedIn, setLoggedIn] = useState(!!user);

  onAuthStateChanged(auth, (user) => {
  if (user) {
    setLoggedIn(true)
  } else {
    setLoggedIn(false)
  }
});
console.log("working");

  return (
    <NativeBaseProvider>
      {/* <NavigationContainer theme = {MyTheme}> */}
      <NavigationContainer>
        <Stack.Navigator>
        
         { 
            
            loggedIn ? <Stack.Screen name="Home" component={TabNavigation}  options={{ headerBackVisible: false,  headerShown: false, }}/>  
                    :  <Stack.Screen name="Login" component={LoginForm} />

          }
          <Stack.Screen name="Sign Up" component={SignUpForm} options={{ headerBackVisible: true }}/>
          <Stack.Screen name="Create Chat" component={CreateChatScreen}/>
          <Stack.Screen name="Chat" component={ChatScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;