import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Inbox, Plus, Upload, Search, FileText, Users } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A component that displays a message when there's no data to show.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "simple", "compact"],
      description: "The visual variant of the empty state",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the empty state",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {
  args: {
    title: "No items found",
    description: "There are no items to display at this time.",
    icon: "Inbox",
    variant: "default",
    size: "md",
    centered: true,
  },
};

export const WithActions: Story = {
  args: {
    ...Basic.args,
    action: {
      label: "Create Item",
      onClick: () => console.log("Create clicked"),
      icon: "Plus",
    },
    secondaryAction: {
      label: "Learn More",
      onClick: () => console.log("Learn more clicked"),
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <EmptyState
        title="Default Variant"
        description="This is the default variant with more padding."
        icon="Inbox"
        variant="default"
      />
      <EmptyState
        title="Simple Variant"
        description="This is the simple variant with less padding."
        icon="Inbox"
        variant="simple"
      />
      <EmptyState
        title="Compact Variant"
        description="This is the compact variant with minimal padding."
        icon="Inbox"
        variant="compact"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <EmptyState
        title="Small Size"
        description="This is the small size variant."
        icon="Inbox"
        size="sm"
      />
      <EmptyState
        title="Medium Size"
        description="This is the medium size variant."
        icon="Inbox"
        size="md"
      />
      <EmptyState
        title="Large Size"
        description="This is the large size variant."
        icon="Inbox"
        size="lg"
      />
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    title: "No Results Found",
    description:
      "Try adjusting your search or filter to find what you're looking for.",
    image: "https://placehold.co/200x200",
    action: {
      label: "Clear Filters",
      onClick: () => console.log("Clear filters clicked"),
      icon: "Search",
    },
  },
};

export const CommonUseCases: Story = {
  render: () => (
    <div className="space-y-8">
      <EmptyState
        title="No Files Uploaded"
        description="Upload your first file to get started."
        icon="Upload"
        action={{
          label: "Upload File",
          onClick: () => console.log("Upload clicked"),
          icon: "Upload",
        }}
      />

      <EmptyState
        title="No Documents Found"
        description="Create a new document to get started."
        icon="FileText"
        action={{
          label: "New Document",
          onClick: () => console.log("New document clicked"),
          icon: "Plus",
        }}
      />

      <EmptyState
        title="No Team Members"
        description="Invite team members to collaborate."
        icon="Users"
        action={{
          label: "Invite Members",
          onClick: () => console.log("Invite clicked"),
          icon: "Plus",
        }}
      />
    </div>
  ),
};

export const WithFooter: Story = {
  args: {
    ...Basic.args,
    action: {
      label: "Create Item",
      onClick: () => console.log("Create clicked"),
      icon: "Plus",
    },
    footer: (
      <div className="text-sm text-gray-500">
        Need help?{" "}
        <a href="#" className="text-primary-600 hover:underline">
          Contact support
        </a>
      </div>
    ),
  },
};

export const Complex: Story = {
  args: {
    title: "No Projects Found",
    description: "Create a new project to start collaborating with your team.",
    icon: "FileText",
    variant: "default",
    size: "lg",
    action: {
      label: "Create Project",
      onClick: () => console.log("Create project clicked"),
      icon: "Plus",
    },
    secondaryAction: {
      label: "Import Project",
      onClick: () => console.log("Import clicked"),
      icon: "Upload",
    },
    footer: (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          You can also import projects from other platforms.
        </p>
        <div className="flex items-center justify-center gap-2">
          <a href="#" className="text-sm text-primary-600 hover:underline">
            Learn more
          </a>
          <span className="text-gray-300">•</span>
          <a href="#" className="text-sm text-primary-600 hover:underline">
            View documentation
          </a>
        </div>
      </div>
    ),
  },
};
