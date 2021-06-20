// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

const firestore = admin.firestore()

exports.createLobby = functions.firestore.document("lobbies/{lobbyID}")
.onCreate((snap: any, context: any) => {
    const data = snap.data()
    if (data) {
        let timeCreated = new Date()
        const initialLobbyInfo = {
            envoyRepresentative: data.lobbyCreator,
            gameMeta: {
                gameID: "default",
                gameStarted: false,
                gameMode: 'default'
            },
            members: {
                players: [
                    data.lobbyCreator
                ],
                viewers: [],
            },
            lobbyCreated: timeCreated.getTime()
        }
        return snap.ref.update(initialLobbyInfo)
    } else {
        return null
    }
})

exports.updateUsersActiveGame = functions.firestore.document("lobbies/{lobbyID}").onSnapshot((snap: any) => {
    const data = snap.data()
    if (data && data.gameID) {
        let promises = []
        for (let player of data.members.players) {
            const promiseP = firestore.doc(`users/${player.userName}`).update(
                {activeGame: data.gameID}
            )
            promises.push(promiseP)
        }
        for (let viewer of data.members.viewers) {
            const promiseV = firestore.doc(`users/${viewer.userName}`).update(
                {viewingGame: data.gameID}
            )
            promises.push(promiseV)
        }
        return Promise.all(promises)
    }
    else {
        return null
    }
})

exports.onUserConnectionStatusChanged = functions.database.ref('/users/{uid}').onUpdate(
    async (change: any, context: any) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();

      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = firestore.doc(`users/${context.params.uid}`);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      functions.logger.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);

      // ... and write it to Firestore.
      return userStatusFirestoreRef.set(eventStatus, {merge: true});
    });
