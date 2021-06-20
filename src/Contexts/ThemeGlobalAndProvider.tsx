import React from 'react'
import baseStyled, { ThemedStyledInterface, ThemeProvider, createGlobalStyle } from 'styled-components'

const breakpoints = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
}

const mediaBreakpoints = {
    mobileS: `(min-width: ${breakpoints.mobileS})`,
    mobileM: `(min-width: ${breakpoints.mobileM})`,
    mobileL: `(min-width: ${breakpoints.mobileL})`,
    tablet: `(min-width: ${breakpoints.tablet})`,
    laptop: `(min-width: ${breakpoints.laptop})`,
    laptopL: `(min-width: ${breakpoints.laptopL})`,
    desktop: `(min-width: ${breakpoints.desktop})`,
    desktopL: `(min-width: ${breakpoints.desktop})`
}

const colors = {
    primary: {1: "#841003", 2: "#AD1D07", 3: "#C52707", 4: "#DE3A11", 5: "#F35627", 6: "#F9703E", 7: "#FF9466", 8: "#FFB088", 9: "#FFD0B5", 10: "#FFE8D9" },
    coolGrey: {1: "#1F2933", 2: "#323F4B", 3: "#3E4C59", 4: "#52606D", 5: "#616E7C", 6: "#7B8794", 7: "#9AA5B1", 8: "#CBD2D9", 9: "#E4E7EB", 10: "#F5F7FA" },
    indigo: {1: "#19216C", 2: "#2D3A8C", 3: "#35469C", 4: "#4055A8", 5: "#4C63B6", 6: "#647ACB", 7: "#7B93DB", 8: "#98AEEB", 9: "#BED0F7", 10: "#E0E8F9" },
    red: {1: "#610404", 2: "#780A0A", 3: "#911111", 4: "#A61B1B", 5: "#BA2525", 6: "#D64545", 7: "#E66A6A", 8: "#F29B9B", 9: "#FACDCD", 10: "#FFEEEE" },
    yellow: {1: "#513C06", 2: "#7C5E10", 3: "#A27C1A", 4: "#C99A2E", 5: "#E9B949", 6: "#F7D070", 7: "#F9DA8B", 8: "#F8E3A3", 9: "#FCEFC7", 10: "#FFFAEB" },
    green: {1: "#05400A", 2: "#0E5814", 3: "#207227", 4: "#2F8132", 5: "#3F9142", 6: "#57AE5B", 7: "#7BC47F", 8: "#A3D9A5", 9: "#C1EAC5", 10: "#E3F9E5" },
    white: "#FFFFFF",
}

export const Theme = {
    breakpoints: {
        deviceSizes: breakpoints,
        mediaQueries: mediaBreakpoints
    },
    colors: colors,
    sizes: {
        1: '1px', 2: '2px', 3: '4px', 4: '8px', 5: '12px', main: '16px', 6: '20px', 7: '24px', 8: '32px', 9: '40px', 10: '64px', medium: '200px', large: '400px'
    },
    testing: false
}

export type ThemeType = typeof Theme

export const ThemeContextProvider = ({children}: any) => {
    return (
        <ThemeProvider theme={Theme}>{children}</ThemeProvider>
    )
}

export const styled = baseStyled as ThemedStyledInterface<ThemeType>

export const ThemeGlobalStyle = createGlobalStyle<{theme: ThemeType}>`
    #root {
        background-color: ${ ({ theme }) => theme.colors.coolGrey[9] };
        height: 100%;
        margin: 0;
    }
    html, body {
        font-family: Avenir, Lato, Helvetica Neue, Arial, sans-serif;
        font-size: ${ ({ theme }) => theme.sizes.main};
        background-color: ${ ({ theme }) => theme.colors.coolGrey[10]};
        text-shadow: none;
        margin: 0;
        box-sizing: border-box;
        height: 100%;
        overflow: hidden;
        min-height: 100%;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        &::before, &::after, &:active, &:hover, &:focus {
            box-sizing: border-box;
            margin: 0;
        }
        &:focus {
            outline: 0;
            box-shadow: 0 0 0 1px ${ ({theme}) => theme.colors.yellow[5] };
        }
    }

    input {
        border: solid ${({theme}) => theme.sizes[1]} ${({theme}) => theme.colors.coolGrey[4]};
        width: 60%;
        min-width: ${ ({ theme }) => theme.sizes['main']};
        max-width: 16rem;
        font-size: ${ ({ theme }) => theme.sizes['main']};
        color: ${ ({ theme }) => theme.colors.coolGrey[3] };
        &:focus {
            border: solid ${({theme}) => theme.sizes[1]} ${({theme}) => theme.colors.primary[7]};
        }
    }

    button {
        all: revert;
        background: ${ ({theme}) => theme.colors.primary[6] };
        color: white;
        text-transform: uppercase;
        border: none;
        width: fit-content;
        height: fit-content;
        letter-spacing: .15em;
        padding: .7em;
        font-size: ${ ({ theme }) => theme.sizes[5]};
        font-weight: 600;
        border-radius: ${ ({ theme }) => theme.sizes[3]};

        &:active, &:hover {
            background: ${ ({theme}) => theme.colors.primary[4] };
        }
        &:active {
            box-shadow: none;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${ ({theme}) => theme.colors.coolGrey[3] };
        letter-spacing: 0.05em;
        margin: 0;
        text-align: left;
        font-weight: 600;
    }

    h1 {
        font-size: ${ ({ theme }) => theme.sizes['main']};
        font-weight: 500;
        padding: 0;
        @media ${({theme}) => theme.breakpoints.mediaQueries.laptop} {
            font-size: ${ ({ theme }) => theme.sizes[6]};
        }
    }

    span {
        color: ${({theme}) => theme.colors.coolGrey[4]};
        text-align: left;
        font-size: ${ ({ theme }) => theme.sizes[5]};
    }
`