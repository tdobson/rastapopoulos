import type { Meta, StoryObj } from '@storybook/react';
import BOMCalculator from './BOMCalculator';

const meta = {
  title: 'Components/BOMCalculator',
  component: BOMCalculator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BOMCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPrefilledGrid: Story = {
  args: {},
  render: () => {
    // This is a mock implementation. You might need to adjust the component
    // to accept an initial grid state as a prop for this to work properly.
    return <BOMCalculator />;
  },
};
