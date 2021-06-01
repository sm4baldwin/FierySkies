import { Timestamp } from '@firebase/firestore'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export interface Iuser {
  data: {
    inRoom: boolean,
    inGame: boolean,
    lobbyCreator: boolean,
    userInfo: 
      {
        userID: string | undefined,
        playerTag: string | undefined,
        activeLobby: string | undefined,
        activeGames: Array<{gameID: string, gameStarted: Timestamp}>,
        
      },

  }
  status: 'idle' | 'loading' | 'failed';
}

const initialState: Iuser = {
  data: {
    inRoom: false,
    inGame: false,
    lobbyCreator: false,
    userInfo: {
      userID: undefined,
      playerTag: undefined,
      activeLobby: undefined,
      activeGames: [],
    }
  },
  status: 'idle',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    inRoom: (state, action: PayloadAction<boolean>) => {
      state.data.inRoom = action.payload
    },
    makeLobbyCreator: (state) => {
      state.data.lobbyCreator = true
    },
  },
})

export const { inRoom, makeLobbyCreator } = userSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectInRoom = (state: RootState) => state.user.data.inRoom
export const selectLobbyCreator = (state: RootState) => state.user.data.lobbyCreator
export const selectUserInfo = (state: RootState) => state.user.data.userInfo

export default userSlice.reducer;