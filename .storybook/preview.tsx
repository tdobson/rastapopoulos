import React from 'react';
import type { Preview } from '@storybook/react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from '../theme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <ColorSchemeScript />
        <MantineProvider theme={theme}>
          <Story />
        </MantineProvider>
      </>
    ),
  ],
};

export default preview;
