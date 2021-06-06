import React, { useState, useEffect } from 'react'
import { FlexDiv, RFC, Spacer, StyledChatBubble } from '../Common/helpfulComponents'
import Slide from '@material-ui/core/Slide'

import { useHistory } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../Common/hooks'
import { joinRoom, selectRoomInfo } from '../features/database/databaseSlice'
import { selectInRoom } from '../features/user/userSlice'

import { styled } from '../Contexts/ThemeGlobalAndProvider'

export const CentralRift = () => {
    const [lobbyPrompt, setLobbyPrompt] = useState('')
    const [lobbyPromptToggled, setLobbyPromptToggled] = useState<boolean>(false)
    const history = useHistory()
    const dispatch = useAppDispatch()
    const inRoom = useAppSelector(selectInRoom)
    const roomInfo = useAppSelector(selectRoomInfo)

    useEffect(() => {
        if (inRoom && roomInfo.id) {
            history.push(`/CentralRift/DepartureZone/${roomInfo.id}`)
        }
    }, [inRoom, roomInfo, history])

    return (
        <FlexDiv>
            <RFC axis='column' align='center' justify='flex-start' css='height: 100%;'>

            <StyledChatBubble>Welcome to Thracia's central Rift. We are preparing to send the next envoy. Please join your respective envoy and begin preparations for the transfer.</StyledChatBubble>
            <Spacer spaceParam={10} />
            <StyledBigButton onClick={() => setLobbyPromptToggled(prev => !prev)}>
                Rift Transfer
            </StyledBigButton>
            {lobbyPromptToggled && <StyledBackdrop onClick={() => setLobbyPromptToggled(prev => !prev)} />}
            <Slide in={lobbyPromptToggled} direction='up' mountOnEnter unmountOnExit>
                <StyledLobbyForm onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(joinRoom(lobbyPrompt))
                        setLobbyPrompt('')
                    }}>
                    <RFC axis='column' align='center'>
                        <h1>Please enter the name of the envoy you will transfer with</h1>
                        <Spacer />
                        <StyledInput type='text' value={lobbyPrompt} onChange={(e) => {
                            e.preventDefault()
                            setLobbyPrompt(e.target.value)
                        }} />
                        <Spacer />
                        <RFC axis='row' justify='center' css='width: 100%;'>
                            <StyledButton type='button' onClick={() => {
                                setLobbyPromptToggled(prev => !prev)
                                
                            }}>Stay Back For Now</StyledButton>
                            <Spacer />
                            <StyledButton>Confirm Envoy</StyledButton>
                        </RFC>
                    </RFC>
                </StyledLobbyForm>
            </Slide>
            </RFC>
        </FlexDiv>
    )
}
const StyledBackdrop = styled.div`
    width: 100%;
    height: 100%;
    z-index: 4;
    background: rgba(45,58,140, .5);
    position: fixed;
    top: 0;
    right: 0;
`
const StyledLobbyForm = styled.form`
    border: solid ${ ({ theme }) => theme.sizes[1]} ${({ theme }) => theme.colors.coolGrey[5]};
    border-radius: ${ ({ theme }) => theme.sizes[3]} 0 ${ ({ theme }) => theme.sizes[3]}0;
    background-color: ${({ theme }) => theme.colors.white};
    padding: ${ ({ theme }) => theme.sizes[4]};
    max-width: 80%;
    z-index: 5;
    position: fixed;
    top: 10rem;
    margin: 0 auto;
`
const StyledInput = styled.input`
    font-size: ${ ({ theme }) => theme.sizes['main']};
    color: ${ ({ theme }) => theme.colors.coolGrey[3] };
`
const StyledBigButton = styled.button`
    position: relative;
    min-width: 6rem;
    font-size: ${ ({ theme }) => theme.sizes['main']};
    width: auto;
    @media ${({theme}) => theme.breakpoints.mediaQueries.laptop} {
        top: 12.5rem;
    }
`
const StyledButton = styled.button`
    min-width: 12rem;
    width: 40%;
    max-width: 18rem;
    font-size: ${ ({ theme }) => theme.sizes[5]};
`