import { Heading, HStack, Text, View } from 'native-base'
import React from 'react'

const LongPost = ({post}) => {
  return (
      <View>
    <HStack>
          <Heading fontWeight="300" size="sm">

            {post.userHandle}
          </Heading>
          <Heading fontWeight="100" size="sm">
            {post.createdAt}
          </Heading>
          </HStack>
          <Heading size="lg"> {post.title} </Heading>
          <Heading size="sm"> {post.flair} </Heading>
          {post.topics?.map((topic, idx) => (
            <Text key={idx}> {topic} </Text>
          ))}
          <Text> {post.body} </Text>
        </View>
  )
}

export default LongPost