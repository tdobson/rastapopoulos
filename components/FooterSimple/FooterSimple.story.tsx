import type { Meta, StoryObj } from '@storybook/react';
import { FooterSimple } from './FooterSimple';

const meta: Meta<typeof FooterSimple> = {
  title: 'Components/FooterSimple',
  component: FooterSimple,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FooterSimple>;

export const Default: Story = {};
