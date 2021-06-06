import React from 'react'
import { useTheme } from 'styled-components'
import { styled, Theme, ThemeType } from '../Contexts/ThemeGlobalAndProvider'

interface IStyledPropsShortHand {
    basis?: string;
    axis: 'row' | 'column';
    flip?: boolean;
    justify? : 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    justifyMobile? : 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    justifyLaptop? : 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignLaptop?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    css? : string;
    breakpoint? : number;
    ref?: any;
    pathname?: string;
}
export const RFC = styled.div<IStyledPropsShortHand>`
    display: flex;
    flex-direction: ${(props) => props.axis};
    flex-wrap: nowrap;
    justify-content: ${(props) => props.justifyMobile ? props.justifyMobile : props.justify ? props.justify : 'center'};
    flex-basis: ${(props) => props.basis ? props.basis : '100%'};
    text-align: center;
    ${(props) => props.align ? `align-items: ${props.align};` : ''}

    @media ${(props) => !props.breakpoint ? props.theme.breakpoints.mediaQueries.laptop : (`(min-width: ${props.breakpoint}px)`)} {
        flex-direction: ${(props) => props.flip ? props.axis === 'row' ? 'column' : 'row' : props.axis};
        justify-content: ${(props) => props.justifyLaptop ? props.justifyLaptop : props.justify ? props.justify : 'center'};
        align-items: ${(props) => props.alignLaptop ? props.alignLaptop : props.align ? props.align : 'center'};
    }

    ${(props) => props.css ? props.css : ''}
`
interface IFlexDiv {
    backgroundColor?: string;
    children: any;
    style?: object;
}
export const FlexDiv = ({children, backgroundColor='inherit', style={}}: IFlexDiv) => {
    return (
        <div style={{width: '100%', height: '100%', flex: 1, overflow: 'auto', padding: '1rem', backgroundColor: backgroundColor, ...style}} >{children}</div>
    )
}

interface IProps {
    direction?: 'horizontal' | 'vertical' | 'block';
    spaceParam?: keyof typeof Theme.sizes;
    testing?: boolean;
}
export const Spacer = ({direction='block', spaceParam='main', testing=true}: IProps) => {
    // @ts-ignore
    const theme: ThemeType = useTheme()
    if (!theme.testing) {
        testing = false
    }
    //@ts-ignore
    return (
        <span style={
            direction === 'horizontal' ? {
                display: 'block',
                alignSelf: 'center',
                justifySelf: 'center',
                height: '0px', 
                minHeight: '0px',
                width: theme.sizes[spaceParam],
                minWidth: theme.sizes[spaceParam],
                border: testing ? '1px solid orange' : '1px solid transparent',
            } : direction === 'vertical' ? {
                display: 'block',
                alignSelf: 'center',
                justifySelf: 'center',
                height: theme.sizes[spaceParam], 
                minHeight: theme.sizes[spaceParam],
                width: '0px',
                minWidth: '0px',
                border: testing ? '1px solid orange' : '1px solid transparent',
            } : {
                display: 'block',
                alignSelf: 'center',
                justifySelf: 'center',
                height: theme.sizes[spaceParam], 
                minHeight: theme.sizes[spaceParam],
                width: theme.sizes[spaceParam],
                minWidth: theme.sizes[spaceParam],
                border: testing ? '1px solid orange' : '1px solid transparent',
            }
    
        }></span>
    )
}

export const StyledChatBubble = styled.div`
    position: relative;
    width: '80%';
    text-align: center;
    line-height: 1.4em;
    background-color: ${ ({ theme }) => theme.colors.white };
    border: ${ ({ theme }) => theme.sizes[3]} solid ${ ({ theme }) => theme.colors.coolGrey[3] };
    border-radius: ${ ({ theme }) => theme.sizes[8]} ;
    padding: ${ ({ theme }) => theme.sizes[6]} ;
    font-size: ${ ({ theme }) => theme.sizes[6]} ;
    font-weight: 500;
    letter-spacing: 0.05em;
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
