// //check if the person that's logging in is in a family
// //if they are not then they have to pick one 
// //now that they are, we check users to see what family they're in 
// //populate users table
// // return family token

import { getAuth } from 'firebase/auth';
import db from "../db";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";



const auth = getAuth();
let initialized = false;
// const user = auth.currentUser;
let familyId = "";
const usersTable = [];

const populateTable = async () => {
    console.log("populating users table", familyId);
    //TODO: make this use the family users not the overall users
    // const querySnapshot = await getDocs(collection(db, "families", familyId, "users"));
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    usersTable.push({id: doc.id, displayName: doc.data().displayName})
    });
    console.log(usersTable);
}

//takes boolean value of initialized or not and returns family id for the current user, if they aren't in a family, returns empty string
exports.familyId = async () => {

    if (initialized) {
        console.log("alread init, fam is ", familyId);
        return familyId;
    }


    // const docRef = doc(db, "cities", "SF");
    // const docSnap = await getDoc(docRef);
    
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }


    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log(userSnap.data()?.familyId);
        familyId = userSnap.data()?.familyId;
        console.log("fam id in get doc", familyId);
        if (familyId) {
            populateTable();
        }
        initialized = true;
        return familyId;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }   

}


exports.getNameFromUserId = (id) => {
   console.log(usersTable.find((e) => e.id == id)?.displayName)
    return usersTable.find((e) => e.id == id)?.displayName;
}


exports.FAMILY_TOKEN = "Nuw0XDoShVApqgv0eDHe";
// // export default "Nuw0XDoShVApqgv0eDHe";