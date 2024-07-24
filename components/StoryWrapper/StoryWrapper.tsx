import React from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';

interface StoryWrapperProps {
  children: React.ReactNode;
}

export function StoryWrapper({ children }: StoryWrapperProps) {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  );
}
