'use client';

// app/layout.tsx
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, AppShell, Burger, Text } from '@mantine/core';
import { useState } from 'react';
import { theme } from '../theme';
import { QueryProvider } from './QueryProvider';
import { NavbarSimpleColored } from '../components/NavbarSimpleColored/NavbarSimpleColored'

function AppShellRasta({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
          <Text>Tim's magic apps</Text>
        <Burger opened={opened} onClick={() => setOpened((o) => !o)} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarSimpleColored />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

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
                <AppShellRasta>{children}</AppShellRasta>
            </MantineProvider>
        </QueryProvider>
        </body>
        </html>
    );
}
