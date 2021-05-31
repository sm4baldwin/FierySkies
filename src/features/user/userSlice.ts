import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export interface Iuser {
  data: {
    inRoom: boolean,
    inGame: boolean,
    lobbyCreator: boolean,
    playerTag: string
  }
  status: 'idle' | 'loading' | 'failed';
}

const initialState: Iuser = {
  data: {
    inRoom: false,
    inGame: false,
    lobbyCreator: false,
    playerTag: 'Default Player Tag'
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

export default userSlice.reducer;