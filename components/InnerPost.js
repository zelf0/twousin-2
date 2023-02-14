import React from 'react'
import ImagePost from './ImagePost';
import LongPost from './LongPost';
import Poll from './Poll';
import ShortPost from './ShortPost';

const InnerPost = ({post}) => {

    switch(post.type) {
        case "long":
          return <LongPost post={post} />
          break;
        case "image":
            return <ImagePost post={post} />
          break;
        case "poll":
            return <Poll post={post}/>
            break;
        case "short": 
            return <ShortPost post={post}/>
            break;
        default:
          return <LongPost post={post} />
      }

}

export default InnerPost