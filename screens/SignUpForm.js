
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { Box, Button, Center, FormControl, Heading, HStack, Input, Link, Text, VStack } from 'native-base';
import React, { useState } from 'react'

const SignUpForm = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const auth = getAuth();


  const createAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: username
        }).then(() => {
          // Profile updated!
          // ...ß
        }).catch((error) => {
          alert(error);
          // An error occurred
          // ...
        });
        // Signed in

        navigation.navigate('Home');
      })
      .catch((error) => {
        console.log(error);
        alert(error);
        // ..
      });
      setEmail("");
      setPassword("");
  }

    return (<Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }} fontWeight="semibold">
            Welcome to Twousin!
          </Heading>
          <Heading mt="1" color="coolGray.600" _dark={{
          color: "warmGray.200"
        }} fontWeight="medium" size="xs">
            Sign up to continue!
          </Heading>
          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input onChangeText={value => setEmail(value)} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input onChangeText={value => setPassword(value)} type="password" />
            </FormControl>
            <FormControl>
              {/* TODO: make passwords have to match */}
              <FormControl.Label>Confirm Password</FormControl.Label>
              <Input type="password" />
            </FormControl>
            <FormControl>
              <FormControl.Label>Username</FormControl.Label>
              <Input onChangeText={value => setUsername(value)} />
            </FormControl>
            <Button mt="2" colorScheme="indigo" onPress={createAccount}>
              Sign up
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
                Already have an account?{" "}
              </Text>
              <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }} onPress={() => navigation.navigate('Login')}>
                Log In
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    )
  };

  export default SignUpForm;