import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./container";

const meta: Meta<typeof Container> = {
  title: "UI/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible container component that provides consistent page width and padding.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "The maximum width of the container",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "The padding around the container",
    },
    centered: {
      control: "boolean",
      description: "Whether the container should be centered",
    },
    fullHeight: {
      control: "boolean",
      description: "Whether the container should take full height",
    },
    withBackground: {
      control: "boolean",
      description: "Whether the container should have a background color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

// Basic Container
export const Basic: Story = {
  args: {
    children: (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Basic Container</h2>
        <p>This is a basic container with default settings.</p>
      </div>
    ),
  },
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <Container size="sm">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Small Container</h2>
          <p>This container has a small maximum width.</p>
        </div>
      </Container>
      <Container size="md">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Medium Container</h2>
          <p>This container has a medium maximum width.</p>
        </div>
      </Container>
      <Container size="lg">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Large Container</h2>
          <p>This container has a large maximum width.</p>
        </div>
      </Container>
      <Container size="xl">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Extra Large Container</h2>
          <p>This container has an extra large maximum width.</p>
        </div>
      </Container>
    </div>
  ),
};

// Different Padding
export const Padding: Story = {
  render: () => (
    <div className="space-y-8">
      <Container padding="none">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">No Padding</h2>
          <p>This container has no padding.</p>
        </div>
      </Container>
      <Container padding="sm">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Small Padding</h2>
          <p>This container has small padding.</p>
        </div>
      </Container>
      <Container padding="md">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Medium Padding</h2>
          <p>This container has medium padding.</p>
        </div>
      </Container>
      <Container padding="lg">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Large Padding</h2>
          <p>This container has large padding.</p>
        </div>
      </Container>
    </div>
  ),
};

// With Background
export const WithBackground: Story = {
  args: {
    withBackground: true,
    children: (
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Container with Background
        </h2>
        <p>This container has a background color.</p>
      </div>
    ),
  },
};

// Full Height
export const FullHeight: Story = {
  args: {
    fullHeight: true,
    withBackground: true,
    children: (
      <div className="flex items-center justify-center h-full">
        <div>
          <h2 className="text-lg font-semibold mb-2">Full Height Container</h2>
          <p>This container takes up the full height of its parent.</p>
        </div>
      </div>
    ),
  },
};

// Not Centered
export const NotCentered: Story = {
  args: {
    centered: false,
    children: (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Not Centered Container</h2>
        <p>This container is not centered on the page.</p>
      </div>
    ),
  },
};

// Complex Content
export const ComplexContent: Story = {
  args: {
    size: "lg",
    padding: "lg",
    withBackground: true,
    children: (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">Page Title</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is a complex container with multiple sections.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Section 1</h3>
            <p>Content for section 1</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Section 2</h3>
            <p>Content for section 2</p>
          </div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Footer Section</h3>
          <p>Additional content or footer information</p>
        </div>
      </div>
    ),
  },
};
