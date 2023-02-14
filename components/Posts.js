import React from 'react'
import { View, Text, ScrollView } from 'react-native'
// import { ScrollView } from 'react-native-web'
import Post from './Post'

const Posts = ({navigation, posts}) => {

        return (
            //TODO: hide progress indicator for scrollview
            <ScrollView width = "100%" bg = "primary.500" showsVerticalScrollIndicator={false} > 
                <Text> Posts </Text>
                {posts.map((post, idx) => <Post navigation={navigation} postData={post.data} id = {post.id} key = {idx}/>)}
            </ScrollView>
          )

  
}

export default Posts