import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SkipLink } from "./skip-link";

const meta: Meta<typeof SkipLink> = {
  title: "UI/SkipLink",
  component: SkipLink,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A skip link component that helps keyboard users skip to the main content of the page.",
      },
    },
  },
  argTypes: {
    targetId: {
      control: "text",
      description: "The ID of the target element to skip to",
    },
    showOnFocus: {
      control: "boolean",
      description: "Whether to show the link only on focus",
    },
    position: {
      control: "select",
      options: ["top-left", "top-right", "top-center"],
      description: "The position of the skip link",
    },
    offset: {
      control: "text",
      description: "The offset from the top and sides",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Basic: Story = {
  args: {
    targetId: "main-content",
    children: "Skip to main content",
  },
};

export const CustomText: Story = {
  args: {
    targetId: "main-content",
    children: "Skip navigation",
  },
};

export const TopRight: Story = {
  args: {
    targetId: "main-content",
    position: "top-right",
  },
};

export const TopCenter: Story = {
  args: {
    targetId: "main-content",
    position: "top-center",
  },
};

export const CustomOffset: Story = {
  args: {
    targetId: "main-content",
    offset: "2rem",
  },
};

export const CustomStyles: Story = {
  args: {
    targetId: "main-content",
    className: "bg-gray-900 text-white",
    focusClassName: "bg-gray-800",
  },
};

export const AlwaysVisible: Story = {
  args: {
    targetId: "main-content",
    showOnFocus: false,
  },
};

export const WithCustomTarget: Story = {
  args: {
    targetId: "custom-target",
    children: "Skip to custom section",
  },
};

export const Demo: Story = {
  render: () => (
    <div className="min-h-screen">
      <SkipLink targetId="main-content" />
      <header className="bg-gray-100 p-4">
        <nav className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </nav>
      </header>
      <main id="main-content" className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Main Content</h1>
        <p className="text-gray-600">
          This is the main content of the page. The skip link above will help
          keyboard users skip the navigation and jump directly to this section.
        </p>
      </main>
    </div>
  ),
};

export const MultipleTargets: Story = {
  render: () => (
    <div className="min-h-screen">
      <SkipLink targetId="main-content" />
      <SkipLink
        targetId="footer"
        position="top-right"
        children="Skip to footer"
      />
      <header className="bg-gray-100 p-4">
        <nav className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </nav>
      </header>
      <main id="main-content" className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Main Content</h1>
        <p className="text-gray-600">
          This is the main content of the page. The skip link above will help
          keyboard users skip the navigation and jump directly to this section.
        </p>
      </main>
      <footer id="footer" className="bg-gray-100 p-4">
        <p className="text-gray-600">
          This is the footer. There's another skip link to jump here directly.
        </p>
      </footer>
    </div>
  ),
};
