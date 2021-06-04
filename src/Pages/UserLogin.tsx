import React, { useState } from 'react'
import { FlexDiv, RFC, Spacer, } from '../Common/helpfulComponents'
import Slide from '@material-ui/core/Slide'

import { useAppDispatch } from '../Common/hooks'
import { userLogin, newUserLogin } from '../features/database/databaseSlice'

import { styled } from '../Contexts/ThemeGlobalAndProvider'

export const UserLogin = () => {
    const [existingUserIDPrompt, setExistingUserIDPrompt] = useState({username: '', pass: ''})
    const [existingUserIDPromptToggled, setExistingUserIDPromptToggled] = useState<boolean>(false)
    const [newUserIDPrompt, setNewUserIDPrompt] = useState({username: '', pass: ''})
    const [newUserIDPromptToggled, setNewUserIDPromptToggled] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    return (
        <FlexDiv>
            <RFC axis='column' align='center' justify='flex-start' css='height: 100%;'>

            <StyledChatBubble>Hello! If you are a returning agent please check in with the Rift Overseer, otherwise speak with the Rift Coordinator to verify sponsorship and Rift Alignment capabilities.</StyledChatBubble>
            <Spacer spaceParam={8} />
            <StyledPortalOverseerButton onClick={() => setExistingUserIDPromptToggled(prev => !prev)}>
                Rift Overseer <em>(login)</em>
            </StyledPortalOverseerButton>
            <Spacer spaceParam={5} />
            <StyledRiftPermissionButton onClick={() => setNewUserIDPromptToggled(prev => !prev)}>
                Rift Coordinator <em>(new user)</em>
            </StyledRiftPermissionButton>
            {existingUserIDPromptToggled && <StyledBackdrop onClick={() => setExistingUserIDPromptToggled(prev => !prev)} />}
            <Slide in={existingUserIDPromptToggled} direction='up' mountOnEnter unmountOnExit>
                <StyledLobbyForm onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(userLogin(existingUserIDPrompt))
                        setExistingUserIDPrompt({username: '', pass: ''})
                    }}>
                    <RFC axis='column' align='center' css='width: 100%;'>
                        <h1 style={{textAlign: 'center'}}>Please provide your Agent Code Name, and if applicable your Sponsor's Seal</h1>
                        <Spacer />
                        <span>Code Name <em>(username)</em></span>
                        <StyledInput type='text' value={existingUserIDPrompt.username} onChange={(e) => {
                            e.preventDefault()
                            setExistingUserIDPrompt(prev => ({...prev, username: e.target.value}))
                        }} />
                        <Spacer />
                        <span>Sponsor's Seal <em>(password ?)</em></span>
                        <StyledInput type='text' value={existingUserIDPrompt.pass} onChange={(e) => {
                            e.preventDefault()
                            setExistingUserIDPrompt(prev => ({...prev, pass: e.target.value}))
                        }} />
                        <Spacer />
                        <StyledButton>Confirm</StyledButton>
                    </RFC>
                </StyledLobbyForm>
            </Slide>
            {newUserIDPromptToggled && <StyledBackdrop onClick={() => setNewUserIDPromptToggled(prev => !prev)} />}
            <Slide in={newUserIDPromptToggled} direction='up' mountOnEnter unmountOnExit>
                <StyledLobbyForm onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(newUserLogin(newUserIDPrompt))
                        setNewUserIDPrompt({username: '', pass: ''})
                    }}>
                    <RFC axis='column' align='center' css='width: 100%;'>
                        <h1 style={{textAlign: 'center'}}>Please provide your Agent Code Name and your Sponsor's Seal</h1>
                        <Spacer />
                        <span>Code Name <em>(username)</em></span>
                        <StyledInput type='text' value={newUserIDPrompt.username} onChange={(e) => {
                            e.preventDefault()
                            setNewUserIDPrompt(prev => ({...prev, username: e.target.value, }))
                        }} />
                        <Spacer />
                        <span>Seal <em>(password optional)</em></span>
                        <StyledInput type='text' value={newUserIDPrompt.pass} onChange={(e) => {
                            e.preventDefault()
                            setNewUserIDPrompt(prev => ({...prev, pass: e.target.value, }))
                        }} />
                        <Spacer />
                        <StyledButton>Verify Rift Alignment</StyledButton>
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
    width: 50%;
    min-width: 300px;
    max-width: 80%;
    z-index: 5;
    position: fixed;
    top: 10rem;
    margin: 0 auto;
`
const StyledInput = styled.input`
    width: 60%;
    min-width: ${ ({ theme }) => theme.sizes['main']};
    max-width: 16rem;
    font-size: ${ ({ theme }) => theme.sizes['main']};
    color: ${ ({ theme }) => theme.colors.coolGrey[3] };
`
const StyledPortalOverseerButton = styled.button`
    min-width: 12rem;
    width: 40%;
    max-width: 18rem;
    font-size: ${ ({ theme }) => theme.sizes[5]};
`
const StyledRiftPermissionButton = styled.button`
    min-width: 12rem;
    width: 40%;
    max-width: 18rem;
    font-size: ${ ({ theme }) => theme.sizes[5]};
`
const StyledButton = styled.button`
    width: 60%;
    min-width: ${ ({ theme }) => theme.sizes['main']};
    max-width: 16rem;
    font-size: ${ ({ theme }) => theme.sizes[5]};
    text-transform: uppercase;
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
    font-weight: 600;
    letter-spacing: .1em;
    color: ${ ({ theme }) => theme.colors.coolGrey[3]};

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
