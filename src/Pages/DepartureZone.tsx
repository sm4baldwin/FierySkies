import React, { useEffect } from 'react'
import { FlexDiv, RFC, } from '../Common/helpfulComponents'


import { useAppSelector, useAppDispatch,  } from '../Common/hooks'
import { selectRoomInfo, startRoomListener, selectRoomMemberCount } from '../features/database/databaseSlice'


import { styled } from '../Contexts/ThemeGlobalAndProvider'

export const DepartureZone = () => {

    const roomInfo = useAppSelector(selectRoomInfo)
    const roomMemberCount = useAppSelector(selectRoomMemberCount)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const unsubscribe = dispatch(startRoomListener())
        return unsubscribe
    }, [dispatch])

    return (
        <FlexDiv>
            <RFC axis='column' align='center' justify='flex-start' css='height: 100%;'>
            <StyledChatBubble>You have joined the envoy '{roomInfo.id}'. Final preparations are under way. Please join the other {roomMemberCount} travelers for the send off.</StyledChatBubble>
            
            </RFC>
        </FlexDiv>
    )
}

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