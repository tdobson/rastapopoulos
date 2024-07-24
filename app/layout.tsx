'use client';

// app/layout.tsx
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, AppShell, Text, Group, Box } from '@mantine/core';
import { useState } from 'react';
import { theme } from '../theme';
import { QueryProvider } from './QueryProvider';
import { NavbarSimpleColored } from '../components/NavbarSimpleColored/NavbarSimpleColored'
import { HeaderTabs } from '../components/HeaderTabs/HeaderTabs'
import { FooterSimple } from '../components/FooterSimple/FooterSimple'

function AppShellRasta({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      layout="alt"
      opened={opened}
      onOpenedChange={setOpened}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text>Tim's magic apps</Text>
          <HeaderTabs />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="0" h="calc(100vh - 60px)" top={60}>
        <NavbarSimpleColored />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <AppShell.Footer p={0} h="auto">
        <FooterSimple />
      </AppShell.Footer>
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
