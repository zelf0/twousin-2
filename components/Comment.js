import { Box, Text } from 'native-base'
import React from 'react'
import { View } from 'react-native'

const Comment = ({comment}) => {
  return (
    <Box minW="100" style={{alignSelf: 'flex-start' }}  bg = "#dec8e6" m={1}>
        <Text color = "lightText" fontWeight = "200">
          {comment.userHandle} 
        </Text >
        <Text color = "lightText" >
           {comment.body}
        </Text> 
    </Box>
  )
}

export default Comment