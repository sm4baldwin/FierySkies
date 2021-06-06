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
  loginStatus: 'idle' | 'pending' | 'succeeded' | 'failed',
  loginError: string | undefined,
  joinRoomStatus: 'idle' | 'pending' | 'succeeded' | 'failed',
  joinRoomError: string | undefined,
}
const initialState: Idatabase = {
  data: {
    room: {
      id: '',
      players: [],
      viewers: []
    }
  },
  loginStatus: 'idle',
  loginError: undefined,
  joinRoomStatus: 'idle',
  joinRoomError: undefined,
}

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
  async (userInfo: {username: string, pass: string}, {dispatch, rejectWithValue}) => {
    try {
      if (/^\s+$/.test(userInfo.username) || userInfo.username.length < 1) {
        throw Error('You are silence incarnate! Worship the Void! Just kidding, you have to give your name.')
      }
      const firestoreDocRef = doc(firestore, "users", userInfo.username)
      const firestoreDocSnap = await getDoc(firestoreDocRef)

      if (!firestoreDocSnap.exists()) {
        throw Error(`We don't have your codename in our system, perhaps speak to the Rift Coordinator.`)
      }
      if (userInfo.pass !== firestoreDocSnap.data().password) {
          throw Error('This seal is a forgery! Perhaps you provided the wrong one, hmmm?')
      } 
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
        if (snapshot.val() === false) {
          setDoc(firestoreDocRef, {connectionStatus: 'offline'}, { merge: true })
          return;
        }

        onDisconnect(realtimeDBuserRef).set(isOfflineForDatabase).then(() => {
          set(realtimeDBuserRef, isOnlineForDatabase)
          setDoc(firestoreDocRef, {connectionStatus: 'online'}, { merge: true })
        })
      })
      dispatch(login(userInfo))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
export const newUserLogin = createAsyncThunk<any, any, {dispatch: AppDispatch, state: RootState}>(
  'database/newUserLogin',
  async (userInfo: {username: string, pass: string}, {dispatch, rejectWithValue}) => {
    try {
      if (/^\s+$/.test(userInfo.username) || userInfo.username.length < 1) {
        throw Error('You are silence incarnate! Worship the Void! Just kidding, you have to give your name.')
      }
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
          if (snapshot.val() === false) {
            setDoc(firestoreDocRef, {connectionStatus: 'offline'}, { merge: true })
            return;
          }

          onDisconnect(realtimeDBuserRef).set(isOfflineForDatabase).then(() => {
            set(realtimeDBuserRef, isOnlineForDatabase)
            setDoc(firestoreDocRef, {connectionStatus: 'online'}, { merge: true })
          })
        })
        dispatch(login(userInfo))
      }
    } catch (error) {
      return rejectWithValue(error.message)
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
        state.joinRoomStatus = 'pending'
      })
      .addCase(joinRoom.fulfilled, (state, action: PayloadAction<string>) => {
        state.joinRoomStatus = 'succeeded'
        state.data.room.id = action.payload
      })
      .addCase(joinRoom.rejected, (state) => {
        state.joinRoomStatus = 'failed'
      })
      .addCase(userLogin.pending, (state) => {
        state.loginStatus = 'pending'
      })
      .addCase(userLogin.fulfilled, (state) => {
        state.loginStatus = 'succeeded'
      })
      .addCase(userLogin.rejected, (state, action: PayloadAction<any>) => {
        state.loginStatus = 'failed'
        state.loginError = action.payload
      })
      .addCase(newUserLogin.pending, (state) => {
        state.loginStatus = 'pending'
      })
      .addCase(newUserLogin.fulfilled, (state) => {
        state.loginStatus = 'succeeded'
      })
      .addCase(newUserLogin.rejected, (state, action: PayloadAction<any>) => {
        state.loginStatus = 'failed'
        state.loginError = action.payload
      })
  },
})

export const { updateRoomPlayers, updateRoomViewers } = databaseSlice.actions

export const selectRoomInfo = (state: RootState) => state.database.data.room
export const selectRoomMemberCount = (state: RootState) => state.database.data.room.players.length + state.database.data.room.viewers.length
export const selectLoginStatus = (state: RootState) => state.database.loginStatus
export const selectLoginError = (state: RootState) => state.database.loginError
export const selectJoinRoomStatus = (state: RootState) => state.database.joinRoomStatus
export const selectJoinRoomError = (state: RootState) => state.database.joinRoomError





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
  