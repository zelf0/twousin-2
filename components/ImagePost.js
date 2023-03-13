import { Heading, HStack, View, Text } from 'native-base'
import React, { useState } from 'react'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Image } from 'react-native';
const storage = getStorage();

const ImagePost = ({post}) => {
  if (!post.uri) {
    return (<Heading> Error getting image </Heading>)
  }

  const [imageRef, setImageRef] = useState(null);
  const [imageURL, setImageURL] = useState("");
  // const getRef = async () => {
  //   await return ref(storage, post.uri);
  // }
    // setImageRef(getRef());
    getDownloadURL(ref(storage, post.uri)).then((url) => {
      setImageURL(url)
    }).catch((e) => {console.log(e)});

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
          {imageURL ? <Image source={{
      uri: imageURL
    }} style={{width: 300, height: 230}} alt="Alternate Text" w="100%"/> : <Text> Uploading Image... </Text>}
    </View>
  )
}

export default ImagePost