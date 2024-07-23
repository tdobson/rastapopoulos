// app/layout.tsx
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import { QueryProvider } from './QueryProvider';
import { NavbarSimpleColored } from '../components/NavbarSimpleColored/NavbarSimpleColored'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <ColorSchemeScript />
            <link rel="shortcut icon" href="/favicon.svg" />
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body>
        <QueryProvider>
            <MantineProvider theme={theme}>

                        {children}

            </MantineProvider>
        </QueryProvider>
        </body>
        </html>
    );
}
