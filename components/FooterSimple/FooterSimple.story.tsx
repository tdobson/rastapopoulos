import type { Meta, StoryObj } from '@storybook/react';
import { FooterSimple } from './FooterSimple';
import { IconHome, IconInfoCircle, IconPhone } from '@tabler/icons-react';

const meta: Meta<typeof FooterSimple> = {
  title: 'Components/FooterSimple',
  component: FooterSimple,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FooterSimple>;

export const Default: Story = {};

export const CustomLinks: Story = {
  args: {
    links: [
      { link: '#', label: 'About', icon: IconInfoCircle },
      { link: '#', label: 'Services', icon: IconHome },
      { link: '#', label: 'Contact', icon: IconPhone },
    ],
  },
};
