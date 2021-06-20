import React, { useEffect } from 'react'
import { FlexDiv, RFC, Spacer, StyledCTABigButton, StyledChatBubble } from '../Common/helpfulComponents'

import { useAppSelector, useAppDispatch,  } from '../Common/hooks'
import { selectRoomInfo, startRoomListener, selectRoomMemberCount, startGame } from '../features/database/databaseSlice'
import { selectLobbyCreator } from '../features/user/userSlice'

export const DepartureZone = () => {

    const roomInfo = useAppSelector(selectRoomInfo)
    const roomMemberCount = useAppSelector(selectRoomMemberCount)
    const lobbyCreator = useAppSelector(selectLobbyCreator)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const unsubscribe = dispatch(startRoomListener())
        return unsubscribe
    }, [dispatch])

    return (
        <FlexDiv>
            <RFC axis='column' align='center' justify='flex-start' css='height: 100%;'>
                <StyledChatBubble>
                    {lobbyCreator ?
                        `You have formed the envoy '${roomInfo.id}'. ${roomMemberCount > 1 ? `There are currently ${roomMemberCount - 1} travelers under your oversight.` : `There are no travelers under your oversight yet.`}`
                        : `You have joined the envoy '${roomInfo.id}'. Final preparations are under way. Please join the other ${roomMemberCount - 1 <= 1 ? `traveler` : `${roomMemberCount - 1} travelers`} for the send off.`}
                </StyledChatBubble>
                <Spacer spaceParam={10} />
                <RFC axis='row' align='flex-start' justify='space-evenly'>
                    <RFC axis='column' justify='flex-start' align='center'>
                        <h1>Players</h1>
                        {roomInfo.players.map((player, index) => {
                            return (
                                <div key={index}>{player.displayName}</div>
                            )
                        })}
                    </RFC>
                    {roomInfo.viewers.length > 0 && <RFC axis='column' justify='flex-start' align='center'>
                        <h1>Viewers</h1>
                        {roomInfo.viewers.map((viewer, index) => {
                            return (
                                <div key={index}>{viewer.displayName}</div>
                            )
                        })}
                    </RFC>}
                </RFC>
                <Spacer spaceParam={6} />
                {lobbyCreator && <StyledCTABigButton onClick={() => {
                    if (roomInfo.gameID) {
                        alert('game already started')
                    } else {
                        dispatch(startGame(""))
                    }
                }}>{roomInfo.gameID ? `Return through Portal`: `Begin Missions`}</StyledCTABigButton>}
            </RFC>
        </FlexDiv>
    )
}

