
  import db from "../db";
  import { doc, getDoc, collection, getDocs } from "firebase/firestore";

  
    // const docRef = doc(db, "users");
    // await getDoc(docRef).then((docSnap) => {
    //     let name = "";
    
    //     if (docSnap.exists()) {
    //         return docSnap.data().displayName;
    //         name += docSnap.data().displayName;
    //         // console.log("Document data:", docSnap.data().displayName, name);
    //     } else {
    //       console.log("No such document!");
    //     }
    //     console.log(name);
    //     return name;
    // })

const usersTable = [];
const populateTable = async () => {
    console.log("populating users table");
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    usersTable.push({id: doc.id, displayName: doc.data().displayName})
    });
    // console.log(usersTable);
}

populateTable();

const getNameFromUserId = (id) => {
   console.log(usersTable.find((e) => e.id == id)?.displayName)
    return usersTable.find((e) => e.id == id)?.displayName;
}

const FAMILY_ID = ""
  
export default getNameFromUserId;