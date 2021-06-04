import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState, AppThunk, AppDispatch } from '../../store'
import { firestore, realtimeDB } from '../../firebaseConfig'
import { doc, getDoc, setDoc, onSnapshot, } from "firebase/firestore"
import { ref, set, onValue, onDisconnect, serverTimestamp } from "firebase/database"
import { inRoom, makeLobbyCreator, login } from '../user/userSlice'

export interface Idatabase {
  data: {
    room: {
      id: string,
      players: Array<{name: string}>,
      viewers: Array<string>
    }
  }
  status: 'idle' | 'pending' | 'succeeded' | 'failed',
}

const initialState: Idatabase = {
  data: {
    room: {
      id: '',
      players: [],
      viewers: []
    }
  },
  status: 'idle',
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const joinRoom = createAsyncThunk<any, any, {dispatch: AppDispatch, state: RootState}>(
  'database/joinRoom',
  async (roomID: string, {dispatch, getState}) => {
    const docRef = doc(firestore, "lobbies", roomID)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      console.log("Joining existing lobby!")
      await setDoc(docRef, {newPlayer: 'Stephen'}, { merge: true })
    } else {
      // doc.data() will be undefined in this case
      console.log("Creating new lobby!")
      const state = getState()
      await setDoc(docRef, {lobbyCreator: state.user.data.userInfo.playerTag ? state.user.data.userInfo.playerTag : 'default'})
      dispatch(makeLobbyCreator())
    }
    dispatch(inRoom(true))
    return roomID
  }
)
export const userLogin = createAsyncThunk<any, any, {dispatch: AppDispatch, state: RootState}>(
  'database/userLogin',
  async (userInfo: {username: string, pass: string | ''}, {dispatch, getState}) => {
    const firestoreDocRef = doc(firestore, "users", userInfo.username)
    const firestoreDocSnap = await getDoc(firestoreDocRef)
    if (!firestoreDocSnap.exists()) {
      throw Error(`We don't have your codename in our system, perhaps speak to the Rift Coordinator.`)
    } else {
      if (userInfo.pass !== firestoreDocSnap.data().password) {
        throw Error('This seal is a forgery! Perhaps you provided the wrong one, hmmm?')
      } else {
        const realtimeDBuserRef = ref(realtimeDB, 'users/' + userInfo.username)
        const infoConnectedRef = ref(realtimeDB,'.info/connected')
        var isOfflineForDatabase = {
          connectionStatus: 'offline',
          last_changed: serverTimestamp(),
        }
        var isOnlineForDatabase = {
          connectionStatus: 'online',
          last_changed: serverTimestamp(),
        }
        onValue(infoConnectedRef, (snapshot) => {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() === false) {
            setDoc(firestoreDocRef, {connectionStatus: 'offline'}, { merge: true })
            return;
          }
      
          // If we are currently connected, then use the 'onDisconnect()' 
          // method to add a set which will only trigger once this 
          // client has disconnected by closing the app, 
          // losing internet, or any other means.
          onDisconnect(realtimeDBuserRef).set(isOfflineForDatabase).then(() => {
            set(realtimeDBuserRef, isOnlineForDatabase)
            setDoc(firestoreDocRef, {connectionStatus: 'online'}, { merge: true })
          })
        })
        dispatch(login(userInfo))
      }
    }
  }
)
export const newUserLogin = createAsyncThunk<any, any, {dispatch: AppDispatch, state: RootState}>(
  'database/newUserLogin',
  async (userInfo: {username: string, pass: string | ''}, {dispatch}) => {
    try {
      const firestoreDocRef = doc(firestore, "users", userInfo.username)
      const firestoreDocSnap = await getDoc(firestoreDocRef)
      if (firestoreDocSnap.exists()) {
        throw Error(`We seem to already have you listed in our records ... interesting. Perhaps you mispoke? Hmmmm?`)
      } else {
        await setDoc(firestoreDocRef, {username: userInfo.username, password: userInfo.pass, connectionStatus: 'online'})
        const realtimeDBuserRef = ref(realtimeDB, 'users/' + userInfo.username)
        await set(realtimeDBuserRef, {connectionStatus: 'offline'})
        const infoConnectedRef = ref(realtimeDB,'.info/connected')
        var isOfflineForDatabase = {
          connectionStatus: 'offline',
          last_changed: serverTimestamp(),
        }
        var isOnlineForDatabase = {
          connectionStatus: 'online',
          last_changed: serverTimestamp(),
        }
        onValue(infoConnectedRef, (snapshot) => {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() === false) {
            setDoc(firestoreDocRef, {connectionStatus: 'offline'}, { merge: true })
            return;
          }
      
          // If we are currently connected, then use the 'onDisconnect()' 
          // method to add a set which will only trigger once this 
          // client has disconnected by closing the app, 
          // losing internet, or any other means.
          onDisconnect(realtimeDBuserRef).set(isOfflineForDatabase).then(() => {
            set(realtimeDBuserRef, isOnlineForDatabase)
            setDoc(firestoreDocRef, {connectionStatus: 'online'}, { merge: true })
          })
        })
        dispatch(login(userInfo))
      }
    } catch (error) {
      console.log(error)
      return error.message
    }
  }
)

export const databaseSlice = createSlice({
  name: 'database',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateRoomPlayers: (state, action: PayloadAction<Array<{name: string}>>) => {
      state.data.room.players = action.payload
    },
    updateRoomViewers: (state, action: PayloadAction<Array<string>>) => {
      state.data.room.viewers = action.payload
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(joinRoom.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(joinRoom.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.data.room.id = action.payload
      })
  },
})

export const { updateRoomPlayers, updateRoomViewers } = databaseSlice.actions

export const selectRoomInfo = (state: RootState) => state.database.data.room
export const selectRoomMemberCount = (state: RootState) => state.database.data.room.players.length + state.database.data.room.viewers.length

export default databaseSlice.reducer

export const startRoomListener = (): AppThunk => (dispatch, getState) => {
  const { database } = getState()
  const roomID = database.data.room.id

  const unsubscribe = onSnapshot(doc(firestore, "lobbies", roomID), (doc) => {
    const roomData = doc.data()
    if (roomData && roomData.members) {
      dispatch(updateRoomPlayers(roomData.members.players))
      dispatch(updateRoomViewers(roomData.members.viewers))
    }
  })

  return unsubscribe
};
  