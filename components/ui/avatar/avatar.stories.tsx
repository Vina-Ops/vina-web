import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: "https://i.pravatar.cc/300",
    alt: "Avatar",
  },
};
