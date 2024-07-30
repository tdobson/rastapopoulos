'use client';

// app/layout.tsx
import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, AppShell, Text, Group, Box } from '@mantine/core';
import { useState } from 'react';
import { theme } from '../theme';
import { QueryProvider } from './QueryProvider';
import { NavbarSimpleColored } from '../components/NavbarSimpleColored/NavbarSimpleColored';
import { HeaderTabs } from '../components/HeaderTabs/HeaderTabs';
import { FooterSimple } from '../components/FooterSimple/FooterSimple';
import { navigationItems } from '../utils/navigationItems';

function AppShellRasta({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);

  const toggleNavbar = () => setOpened((o) => !o);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Text>Tim's magic apps</Text>
          <HeaderTabs />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="0" h="calc(100vh - 60px)" top={60}>
        <NavbarSimpleColored opened={opened} toggle={toggleNavbar} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box mih="calc(100vh - 60px)">{children}</Box>
        <FooterSimple links={navigationItems} />
      </AppShell.Main>
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
