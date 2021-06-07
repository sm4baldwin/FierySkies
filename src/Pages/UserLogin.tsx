import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'

import { useHistory } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../Common/hooks'
import { userLogin, newUserLogin, selectLoginStatus, selectLoginError } from '../features/database/databaseSlice'

import Slide from '@material-ui/core/Slide'
import { 
    FlexDiv, RFC, Spacer, StyledChatBubble, StyledLobbyForm,
    StyledCTAButton, StyledCTABigButton, StyledBackdrop
} from '../Common/helpfulComponents'

export const UserLogin = () => {
    const [existingUserIDPrompt, setExistingUserIDPrompt] = useState({username: '', pass: ''})
    const [existingUserIDPromptToggled, setExistingUserIDPromptToggled] = useState<boolean>(false)
    const [newUserIDPrompt, setNewUserIDPrompt] = useState({username: '', pass: ''})
    const [newUserIDPromptToggled, setNewUserIDPromptToggled] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const history = useHistory()

    const loginStatus = useAppSelector(selectLoginStatus)
    const loginError = useAppSelector(selectLoginError)

    const existingUserPromptRefInput = useRef<HTMLInputElement>(null)
    const newUserPromptRefInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (loginStatus === 'succeeded') {
            history.push('/')
        }
    }, [loginStatus, history])
    useLayoutEffect(() => {
        if (existingUserIDPromptToggled) {
            setTimeout(() => {
                if (existingUserPromptRefInput.current !== null) {
                    existingUserPromptRefInput.current.focus()
                }
            }, 0)
        }
    }, [existingUserIDPromptToggled])
    useLayoutEffect(() => {
        if (newUserIDPromptToggled) {
            setTimeout(() => {
                if (newUserPromptRefInput.current !== null) {
                    newUserPromptRefInput.current.focus()
                }
            }, 0)
        }
    }, [newUserIDPromptToggled])

    return (
        <FlexDiv>
            <RFC axis='column' align='center' justify='flex-start' css='height: 100%;'>

                <StyledChatBubble>{loginStatus === 'pending' ? `scribble scribble scratch scribble` : loginError ? loginError : `Hello! Welcome to Thracia's Central Rift! If you are a returning agent please check in with the Rift Overseer, otherwise speak with the Rift Coordinator to verify sponsorship and Rift Alignment capabilities.`}</StyledChatBubble>
                <Spacer spaceParam={10} />
                <StyledCTABigButton onClick={() => setExistingUserIDPromptToggled(prev => !prev)}>
                    Rift Overseer <em>(login)</em>
                </StyledCTABigButton>
                <Spacer spaceParam={5} />
                <StyledCTABigButton onClick={() => setNewUserIDPromptToggled(prev => !prev)}>
                    Rift Coordinator <em>(new user)</em>
                </StyledCTABigButton>
                {existingUserIDPromptToggled && <StyledBackdrop onClick={() => setExistingUserIDPromptToggled(prev => !prev)} />}
                <Slide in={existingUserIDPromptToggled} direction='up' mountOnEnter unmountOnExit>
                    <StyledLobbyForm onSubmit={(e) => {
                            e.preventDefault()
                            dispatch(userLogin(existingUserIDPrompt))
                            setExistingUserIDPromptToggled(false)
                            setNewUserIDPromptToggled(false)
                            setExistingUserIDPrompt({username: '', pass: ''})
                        }}>
                        <RFC axis='column' align='center' css='width: 100%;'>
                            <h1 style={{textAlign: 'center'}}>Please provide your Agent Code Name, and if applicable your Sponsor's Seal</h1>
                            <Spacer />
                            <span>Code Name <em>(username)</em></span>
                            <input ref={existingUserPromptRefInput} type='text' value={existingUserIDPrompt.username} onChange={(e) => {
                                e.preventDefault()
                                setExistingUserIDPrompt(prev => ({...prev, username: e.target.value}))
                            }} />
                            <Spacer />
                            <span>Sponsor's Seal <em>(password ?)</em></span>
                            <input type='text' value={existingUserIDPrompt.pass} onChange={(e) => {
                                e.preventDefault()
                                setExistingUserIDPrompt(prev => ({...prev, pass: e.target.value}))
                            }} />
                            <Spacer />
                            <StyledCTAButton>Confirm</StyledCTAButton>
                        </RFC>
                    </StyledLobbyForm>
                </Slide>
                {newUserIDPromptToggled && <StyledBackdrop onClick={() => setNewUserIDPromptToggled(prev => !prev)} />}
                <Slide in={newUserIDPromptToggled} direction='up' mountOnEnter unmountOnExit>
                    <StyledLobbyForm onSubmit={(e) => {
                            e.preventDefault()
                            dispatch(newUserLogin(newUserIDPrompt))
                            setExistingUserIDPromptToggled(false)
                            setNewUserIDPromptToggled(false)
                            setNewUserIDPrompt({username: '', pass: ''})
                        }}>
                        <RFC axis='column' align='center' css='width: 100%;'>
                            <h1 style={{textAlign: 'center'}}>Please provide your Agent Code Name and your Sponsor's Seal</h1>
                            <Spacer />
                            <span>Code Name <em>(username)</em></span>
                            <input ref={newUserPromptRefInput} type='text' value={newUserIDPrompt.username} onChange={(e) => {
                                e.preventDefault()
                                setNewUserIDPrompt(prev => ({...prev, username: e.target.value, }))
                            }} />
                            <Spacer />
                            <span>Seal <em>(password optional)</em></span>
                            <input type='text' value={newUserIDPrompt.pass} onChange={(e) => {
                                e.preventDefault()
                                setNewUserIDPrompt(prev => ({...prev, pass: e.target.value, }))
                            }} />
                            <Spacer />
                            <StyledCTAButton>Verify Rift Alignment</StyledCTAButton>
                        </RFC>
                    </StyledLobbyForm>
                </Slide>
            </RFC>
        </FlexDiv>
    )
}


