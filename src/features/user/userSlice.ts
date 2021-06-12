import { Timestamp } from '@firebase/firestore'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export interface Iuser {
  data: {
    inGame: boolean,
    lobbyCreator: boolean,
    userInfo: 
      {
        username: string | undefined,
        pass: string | ''
        playerTag: string | undefined,
        activeLobby: string | undefined,
        activeGames: Array<{gameID: string, gameStarted: Timestamp}>,
        
      },

  }
  status: 'idle' | 'loading' | 'failed';
}

const initialState: Iuser = {
  data: {
    inGame: false,
    lobbyCreator: false,
    userInfo: {
      username: undefined,
      pass: '',
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
    makeLobbyCreator: (state) => {
      state.data.lobbyCreator = true
    },
    login: (state, action: PayloadAction<{username: string, pass: string | '', activeLobby: string | undefined, activeGames: Array<{gameID: string, gameStarted: Timestamp}>, playerTag: string | undefined}>) => {
      state.data.userInfo.username = action.payload.username
      state.data.userInfo.pass = action.payload.pass
      state.data.userInfo.activeLobby = action.payload.activeLobby
      state.data.userInfo.activeGames = action.payload.activeGames
      state.data.userInfo.playerTag = action.payload.playerTag
    }
  },
})

export const { makeLobbyCreator, login } = userSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLobbyCreator = (state: RootState) => state.user.data.lobbyCreator
export const selectUserInfo = (state: RootState) => state.user.data.userInfo

export default userSlice.reducer;