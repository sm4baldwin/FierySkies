import React, { useState, useEffect } from 'react'
import {
    FlexDiv, RFC, Spacer, StyledChatBubble, StyledCTAButton,
    StyledCTABigButton, StyledBackdrop, StyledLobbyForm
} from '../Common/helpfulComponents'
import Slide from '@material-ui/core/Slide'

import { useHistory } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../Common/hooks'
import { joinRoom, selectRoomInfo } from '../features/database/databaseSlice'
import { selectUserInfo } from '../features/user/userSlice'

export const CentralRift = () => {
    const [lobbyPrompt, setLobbyPrompt] = useState('')
    const [lobbyPromptToggled, setLobbyPromptToggled] = useState<boolean>(false)
    const history = useHistory()
    const dispatch = useAppDispatch()
    const roomInfo = useAppSelector(selectRoomInfo)
    const userInfo = useAppSelector(selectUserInfo)

    useEffect(() => {
        if (roomInfo.id) {
            history.push(`/CentralRift/DepartureZone/${roomInfo.id}`)
        }
    }, [roomInfo, history])

    return (
        <FlexDiv>
            <RFC axis='column' align='center' justify='flex-start' css='height: 100%;'>

            <StyledChatBubble>Welcome {userInfo.playerTag ? userInfo.playerTag: userInfo.username}. We are preparing to send the next envoy. With whom will you be transferring?</StyledChatBubble>
            <Spacer spaceParam={10} />
            <StyledCTABigButton onClick={() => setLobbyPromptToggled(prev => !prev)}>
                Rift Transfer
            </StyledCTABigButton>
            {lobbyPromptToggled && <StyledBackdrop onClick={() => setLobbyPromptToggled(prev => !prev)} />}
            <Slide in={lobbyPromptToggled} direction='up' mountOnEnter unmountOnExit>
                <StyledLobbyForm onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(joinRoom(lobbyPrompt))
                        setLobbyPrompt('')
                    }}>
                    <RFC axis='column' align='center' css='width: 100%;'>
                        <h1 style={{textAlign: 'center'}}>Please enter the name of the envoy with which you will transfer</h1>
                        <Spacer />

                        <span>Envoy waiting room</span>
                        <input type='text' value={lobbyPrompt} onChange={(e) => {
                            e.preventDefault()
                            setLobbyPrompt(e.target.value)
                        }} />
                        <Spacer />
                        <StyledCTAButton>Confirm Envoy</StyledCTAButton>
                    </RFC>
                </StyledLobbyForm>
            </Slide>
            </RFC>
        </FlexDiv>
    )
}