import db from "../db";
import {
    getDocs,
    collection,
    orderBy,
    query,
    onSnapshot
  } from "firebase/firestore";

const getFeed = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    // const querySnapshot = await getDocs(q);
    // return querySnapshot.docs;

   const unsub = onSnapshot(q, (querySnapshot) => {
      return querySnapshot.docs;
    });
    
    return unsub;

};

// export default getFeed;