import type { Meta, StoryObj } from '@storybook/react';
import { FooterSimple } from './FooterSimple';
import { StoryWrapper } from '../StoryWrapper/StoryWrapper';

const meta: Meta<typeof FooterSimple> = {
  title: 'Components/FooterSimple',
  component: FooterSimple,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <StoryWrapper><Story /></StoryWrapper>],
};

export default meta;
type Story = StoryObj<typeof FooterSimple>;

export const Default: Story = {};

export const CustomLinks: Story = {
  args: {
    links: [
      { link: '#', label: 'About' },
      { link: '#', label: 'Services' },
      { link: '#', label: 'Contact' },
    ],
  },
};
