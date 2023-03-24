import { Text, Box, Button, Center, FormControl, Heading, HStack, Input, Link, VStack } from 'native-base';
import React from 'react'
import { useState } from 'react';
import signIn from '../services/signIn';


const LoginForm = ({navigation}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("signing in");
    signIn(email, password);
  }
  

    return <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
            Welcome to Twousin!
          </Heading>
          <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
            Sign in to continue!
          </Heading>
  
          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input  onChangeText={value => setEmail(value)}/>
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password"  onChangeText={value => setPassword(value)}/>
              <Link _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "indigo.500",
            }} onPress={() => alert("Todo")} alignSelf="flex-end" mt="1">
                Forget Password?
              </Link>
            </FormControl>
            <Button onPress={handleSubmit} mt="2" type="submit" colorScheme="indigo">
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
                I'm a new user.{" "}
              </Text>
              <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }} onPress={() => navigation.navigate('Sign Up')}>
                Sign Up
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>;
  };

  export default LoginForm