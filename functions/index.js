"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const {default: FAMILY_TOKEN} = require("../services/FAMILY_TOKEN");
admin.initializeApp();
const db = admin.firestore();
const fetch = require("node-fetch");

// exports.testFunc = functions.firestore
//     .document("chats")
//     .onCreate((snapshot) => {
//         functions.logger.info("Hello logs!", { structuredData: true });
//     //   response.send("Hello from Firebase!");
//   });

// exports.sendNotificationOnPostTest = functions.firestore
//     .document("families/{familyId}/posts/{postId}")
//     .onCreate(async (snap, context) => {
//       functions.logger.info("Hello logs!", MYTOKEN);
//       const message = {
//         to: MYTOKEN,
//         sound: "default",
//         title: "Original Title",
//         body: "And here is the body!",
//         data: {someData: "goes here"},
//       };
//       await fetch("https://exp.host/--/api/v2/push/send", {
//         method: "POST",
//         headers: {
//           "Accept": "application/json",
//           "Accept-encoding": "gzip, deflate",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(message),
//       });
//     });


// exports.sendNotificationOnNewGroupChat = functions.firestore
//     .document("families/{familyId}/posts/postId}")
//     .onCreate(async (snap, context) => {
//       functions.logger.info("Hello logs!", MYTOKEN);
//       await admin.messaging().sendMulticast({
//         tokens: [MYTOKEN],
//         notification: {
//           title: "New Group Chat ",
//           body: snap.data().title,
//           imageUrl: "https://my-cdn.com/app-logo.png",
//         },
//       });
//     });

exports.sendNotificationOnMessage = functions.firestore
    .document("families/{famId}/chats/{chatId}/messages/{messageId}")
    .onWrite(async (change, context) => {
      functions.logger.info("Hello logs!");
      // eslint-disable-next-line max-len
      const chatRef = db.doc(`families/${context.params.famId}/chats/${context.params.chatId}`);
      //   functions.logger.info(context.params.chatId);
      let chatSnap;

      await chatRef.get().then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          chatSnap = documentSnapshot;
          functions.logger.info("doc snapshot", documentSnapshot);
          functions.logger.info("chat snap", chatSnap);
        }
      });
      functions.logger.info("chat snap", chatSnap);
      const userTokens = [];

      for (let i = 0; i < chatSnap.data().users.length; i++) {
        const userRef = db.doc(`users/${chatSnap.data().users[i]}`);
        await userRef.get().then((snap) => {
          if (snap.exists) {
            if (snap.data().notificationToken) {
              userTokens.push(snap.data().notificationToken);
            }
          }
        });
      }
      functions.logger.info("tokens", userTokens);
      //   await admin.messaging().sendMulticast({
      //     // tokens of all the users in the group chat
      //     tokens: [...userTokens],
      //     notification: {
      //       // eslint-disable-next-line max-len
      //    title: `${snap.data().displayName} to ${chatSnap.data().chatName}`,
      //       body: snap.data().message,
      //       imageUrl: "https://my-cdn.com/apxp-logo.png",
      //     },
      //   });
      const message = {
        to: [...userTokens],
        sound: "default",
        // eslint-disable-next-line max-len
        title: `${change.after.data().displayName} to ${chatSnap.data().chatName}`,
        body: change.after.data().message,
        data: {someData: "goes here"},
      };
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    });

// await admin.messaging().sendMulticast({
//     tokens: [
//       /* ... */
//     ], // ['token_1', 'token_2', ...]
//     notification: {
//       title: 'Basic Notification',
//       body: 'This is a basic notification sent from the server!',
//       imageUrl: 'https://my-cdn.com/app-logo.png',
//     },
//   });


