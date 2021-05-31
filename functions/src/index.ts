// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

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
