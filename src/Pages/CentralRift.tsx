import React, { useState, useEffect } from 'react'
import { FlexDiv, RFC, Spacer, } from '../Common/helpfulComponents'
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

            <StyledChatBubble>Welcome to Thracia's central Rift. We are preparing to send the next envoy. Please join your other representative and prepare yourself for the transfer.</StyledChatBubble>
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
                        <input type='text' value={lobbyPrompt} onChange={(e) => {
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
    background: rgba(255, 255, 255, 0.5);
    position: fixed;
    top: 0;
    right: 0;
`
const StyledLobbyForm = styled.form`
    border: solid ${ ({ theme }) => theme.sizes[1]} ${({ theme }) => theme.colors.coolGrey[5]};
    border-radius: ${ ({ theme }) => theme.sizes[3]} 0 ${ ({ theme }) => theme.sizes[3]}0;
    background-color: ${({ theme }) => theme.colors.white};
    padding: ${ ({ theme }) => theme.sizes[4]};
    z-index: 5;
    position: fixed;
    top: 10rem;
    margin: 0 auto;
`
const StyledBigButton = styled.button`
    position: fixed;
    top: 12.5rem;
    min-width: 6rem;
    font-size: ${ ({ theme }) => theme.sizes['main']};
    width: auto;
`
const StyledButton = styled.button`
    min-width: 4rem;
    width: auto;
`
const StyledChatBubble = styled.div`
    position: relative;
	width: '80%';
	text-align: center;
	line-height: 1.4em;
	background-color: ${ ({ theme }) => theme.colors.white };
	border: ${ ({ theme }) => theme.sizes[3]} solid ${ ({ theme }) => theme.colors.coolGrey[3] };
	border-radius: ${ ({ theme }) => theme.sizes[8]} ;
	padding: ${ ({ theme }) => theme.sizes[6]} ;
	font-size: ${ ({ theme }) => theme.sizes[6]} ;

    &:before, &:after {
        content: ' ';
	    position: absolute;
	    width: 0;
	    height: 0;
    }
    &:before {
        left: ${ ({ theme }) => theme.sizes[8]};
	    bottom: -${ ({ theme }) => theme.sizes[10]};
	    border: ${ ({ theme }) => theme.sizes[8]} solid;
	    border-color: ${ ({ theme }) => theme.colors.coolGrey[3] } transparent transparent ${ ({ theme }) => theme.colors.coolGrey[3] };
    }
    &:after {
        left: 2.25rem;
	    bottom: -3.35rem;
	    border: ${ ({ theme }) => theme.sizes[8]} solid;
	    border-color: ${ ({ theme }) => theme.colors.white } transparent transparent ${ ({ theme }) => theme.colors.white };
    }
`