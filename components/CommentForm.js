import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Box, Button, FormControl, Icon, IconButton, Input, Stack, Text } from 'native-base'
import React from 'react'
import { useState } from 'react'
import createComment from '../services/createComment'

const CommentForm = ({id, rerenderPost}) => {
    const [comment, setComment] = useState("");
    const [console, setConsole] = useState("console");
    const handleSubmit = () => {
        createComment(id, comment);
        setComment("")
       setConsole("posted comment");
    }
  return (
    <Box w="100%">
      {/* <Text color="lightText"> Console: {console} </Text> */}
      <FormControl>
        
        <Input color = "lightText" value = {comment} size="xs" placeholder="Your Comment Here" onChangeText={value => setComment(value)} 
        InputRightElement={<Icon as={<MaterialIcons name="send" />} size={5} type = "submit" mr="2" color="gray.400" onPress={handleSubmit} />}
        />
      </FormControl>
 
      {/* <Button
        title="Submit" onPress={handleSubmit}
          type="submit"
          fullWidth
      
        >
          Post
        </Button> */}
    </Box>
  )
}

export default CommentForm