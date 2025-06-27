import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonButton,
  SkeletonCard,
} from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible skeleton component for creating loading placeholders with various shapes and sizes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "rounded", "circular"],
      description: "The visual variant of the skeleton",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the skeleton",
    },
    animated: {
      control: "boolean",
      description: "Whether the skeleton is animated",
    },
    disabled: {
      control: "boolean",
      description: "Whether the skeleton is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Basic Skeleton
export const Basic: Story = {
  args: {
    width: 200,
  },
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton variant="default" width={200} />
      <Skeleton variant="rounded" width={200} />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
  ),
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton size="sm" width={200} />
      <Skeleton size="md" width={200} />
      <Skeleton size="lg" width={200} />
    </div>
  ),
};

// Without Animation
export const WithoutAnimation: Story = {
  args: {
    width: 200,
    animated: false,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    width: 200,
    disabled: true,
  },
};

// Skeleton Text
export const Text: Story = {
  render: () => (
    <div className="space-y-4">
      <SkeletonText lines={3} />
      <SkeletonText lines={5} />
    </div>
  ),
};

// Skeleton Avatar
export const Avatar: Story = {
  render: () => (
    <div className="space-y-4">
      <SkeletonAvatar />
      <SkeletonAvatar width={60} height={60} />
    </div>
  ),
};

// Skeleton Image
export const Image: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <SkeletonImage />
      <SkeletonImage height={300} />
    </div>
  ),
};

// Skeleton Button
export const Button: Story = {
  render: () => (
    <div className="space-y-4">
      <SkeletonButton />
      <SkeletonButton width={150} />
    </div>
  ),
};

// Skeleton Card
export const Card: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};

// Complex Example
export const Complex: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="flex items-center space-x-4">
        <SkeletonAvatar />
        <div className="space-y-2 flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <SkeletonImage />
      <div className="space-y-2">
        <SkeletonText lines={3} />
      </div>
      <div className="flex justify-between">
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </div>
  ),
};
