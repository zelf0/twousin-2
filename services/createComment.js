
import {
    updateDoc, 
    arrayUnion,
    doc,
    getDoc,
  } from "firebase/firestore";
  
  import db from "../db";
  import { getAuth } from "firebase/auth";
import { FAMILY_TOKEN } from "./family-module";
  
  const getPostReferenceForCommenting = async (id) => {
  
      console.log("looking for reference");
  
      // let q = query(collection(db, "posts"), where("body", "==", id));
  
      // console.log(q);
      // let querySnapshot = await getDocs(q)
      // console.log(querySnapshot.docs.length);
  
      const docRef = doc(db, "families", 
      FAMILY_TOKEN, "posts", id);
      const docSnap = await getDoc(docRef);
      
      console.log(docRef)
  
      return docSnap.ref;
      // return querySnapshot.docs[0].ref;
  
  }
  
  const createComment = async (id, commentBody) => {
      // try {
          // code that we will 'try' to run
          const auth = getAuth();
          const user = auth.currentUser;
          // const postReference = getPostReferenceForCommenting(id);
          // console.log(postReference, "it worked")
          await getPostReferenceForCommenting(id)
          .then((reference) => {
              console.log(reference, "updating");
              updateDoc(reference, {
                  
                  "comments": arrayUnion({
                      body: commentBody,
                      userHandle: user.displayName ? user.displayName : "no user"
                  })
              
              });
          })
          .catch((err) => console.error(err));
        
      // } catch(error) {
      //     // code to run if there are any problems
      //     console.log("somethhing went wrong");
      //   } 
  }
  
  export default createComment;