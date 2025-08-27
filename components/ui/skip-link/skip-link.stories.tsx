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
          "A skip link component that helps keyboard users skip to the main content of the page. Press Tab to see the skip link appear.",
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
    children: {
      control: "text",
      description: "The text content of the skip link",
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
  parameters: {
    docs: {
      description: {
        story: "The default skip link that appears in the top-left corner when focused.",
      },
    },
  },
};

export const CustomText: Story = {
  args: {
    targetId: "main-content",
    children: "Skip navigation",
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link with custom text content.",
      },
    },
  },
};

export const TopRight: Story = {
  args: {
    targetId: "main-content",
    children: "Skip to main content",
    position: "top-right",
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link positioned in the top-right corner.",
      },
    },
  },
};

export const TopCenter: Story = {
  args: {
    targetId: "main-content",
    children: "Skip to main content",
    position: "top-center",
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link positioned in the top-center.",
      },
    },
  },
};

export const CustomOffset: Story = {
  args: {
    targetId: "main-content",
    children: "Skip to main content",
    offset: "2rem",
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link with custom offset from the edges.",
      },
    },
  },
};

export const CustomStyles: Story = {
  args: {
    targetId: "main-content",
    children: "Skip to main content",
    className: "bg-gray-900 text-white",
    focusClassName: "bg-gray-800",
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link with custom styling classes.",
      },
    },
  },
};

export const AlwaysVisible: Story = {
  args: {
    targetId: "main-content",
    children: "Skip to main content",
    showOnFocus: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link that's always visible instead of only showing on focus.",
      },
    },
  },
};

export const WithCustomTarget: Story = {
  args: {
    targetId: "custom-target",
    children: "Skip to custom section",
  },
  parameters: {
    docs: {
      description: {
        story: "Skip link targeting a custom element ID.",
      },
    },
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
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Services
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Blog
          </a>
        </nav>
      </header>
      <main id="main-content" className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Main Content</h1>
        <p className="mb-4 text-gray-600">
          This is the main content of the page. The skip link above will help
          keyboard users skip the navigation and jump directly to this section.
        </p>
        <p className="text-gray-600">
          Press Tab to see the skip link appear at the top of the page, then
          press Enter to activate it and jump to this content.
        </p>
      </main>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A complete demo showing the skip link in action with a typical page layout. Press Tab to see the skip link appear.",
      },
    },
  },
};

export const MultipleTargets: Story = {
  render: () => (
    <div className="min-h-screen">
      <SkipLink targetId="main-content" />
      <SkipLink
        targetId="sidebar"
        position="top-right"
      >
        Skip to sidebar
      </SkipLink>
      <SkipLink
        targetId="footer"
        position="top-center"
      >
        Skip to footer
      </SkipLink>
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
      <div className="flex">
        <main id="main-content" className="flex-1 p-4">
          <h1 className="mb-4 text-2xl font-bold">Main Content</h1>
          <p className="text-gray-600">
            This is the main content of the page. There are multiple skip links
            available to help keyboard users navigate to different sections.
          </p>
        </main>
        <aside id="sidebar" className="w-64 bg-gray-50 p-4">
          <h2 className="mb-2 text-lg font-semibold">Sidebar</h2>
          <p className="text-sm text-gray-600">
            This is the sidebar content. You can skip directly here using the
            skip link in the top-right.
          </p>
        </aside>
      </div>
      <footer id="footer" className="bg-gray-100 p-4">
        <p className="text-gray-600">
          This is the footer. There's a skip link to jump here directly from
          the top-center position.
        </p>
      </footer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example with multiple skip links targeting different sections of the page.",
      },
    },
  },
};

// Accessibility testing story
export const AccessibilityTest: Story = {
  render: () => (
    <div className="min-h-screen">
      <SkipLink targetId="main-content" />
      <div className="bg-yellow-50 p-4 text-sm">
        <p className="font-medium text-yellow-800">
          Accessibility Test Instructions:
        </p>
        <ol className="mt-2 list-decimal list-inside text-yellow-700">
          <li>Press Tab to focus on the skip link</li>
          <li>Press Enter to activate it</li>
          <li>The focus should move to the main content area</li>
          <li>Continue tabbing to navigate through the content</li>
        </ol>
      </div>
      <header className="bg-gray-100 p-4">
        <nav>
          <h2 className="sr-only">Main Navigation</h2>
          <div className="flex gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Nav Link {i + 1}
              </a>
            ))}
          </div>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className="p-4 focus:outline-none">
        <h1 className="mb-4 text-2xl font-bold">Main Content</h1>
        <p className="mb-4 text-gray-600">
          This demonstrates proper skip link implementation with accessibility
          considerations.
        </p>
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Interactive Element
        </button>
      </main>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A comprehensive accessibility test showing proper skip link implementation with focus management.",
      },
    },
  },
};