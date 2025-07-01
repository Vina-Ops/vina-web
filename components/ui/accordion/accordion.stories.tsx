import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Accordion, AccordionItem } from "./accordion";
import { User, Settings, Bell, Lock, Star, Trash } from "lucide-react";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An Accordion component that displays a list of expandable/collapsible sections. It supports single and multiple expansion modes, various visual styles, and custom icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "separated"],
      description: "The visual variant of the accordion",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the accordion items",
    },
    multiple: {
      control: "boolean",
      description: "Whether multiple items can be expanded at once",
    },
    showChevron: {
      control: "boolean",
      description: "Whether to show the chevron icon",
    },
    animateChevron: {
      control: "boolean",
      description: "Whether to animate the chevron rotation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Basic: Story = {
  render: () => (
    <Accordion>
      <AccordionItem id="item-1" title="What is an accordion?">
        An accordion is a vertically stacked set of interactive headings that
        each contain a title, content snippet, or thumbnail representing a
        section of content.
      </AccordionItem>
      <AccordionItem id="item-2" title="How does it work?">
        The accordion component allows users to expand and collapse sections of
        content, displaying one section at a time or multiple sections
        simultaneously.
      </AccordionItem>
      <AccordionItem id="item-3" title="When should I use it?">
        Use an accordion when you want to display a large amount of content in a
        limited space, or when you want to organize content into logical
        sections.
      </AccordionItem>
    </Accordion>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Accordion>
      <AccordionItem
        id="item-1"
        title="Profile Settings"
        icon={<User className="h-5 w-5 text-gray-400" />}
      >
        Manage your profile information and preferences.
      </AccordionItem>
      <AccordionItem
        id="item-2"
        title="Account Settings"
        icon={<Settings className="h-5 w-5 text-gray-400" />}
      >
        Configure your account settings and security options.
      </AccordionItem>
      <AccordionItem
        id="item-3"
        title="Notifications"
        icon={<Bell className="h-5 w-5 text-gray-400" />}
      >
        Set up your notification preferences and delivery methods.
      </AccordionItem>
    </Accordion>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Accordion variant="default">
        <AccordionItem id="item-1" title="Default Variant">
          This is the default variant with dividers between items.
        </AccordionItem>
        <AccordionItem id="item-2" title="Default Variant">
          The content of the second item.
        </AccordionItem>
      </Accordion>

      <Accordion variant="bordered">
        <AccordionItem id="item-3" title="Bordered Variant">
          This variant has a border around the entire accordion.
        </AccordionItem>
        <AccordionItem id="item-4" title="Bordered Variant">
          The content of the second item.
        </AccordionItem>
      </Accordion>

      <Accordion variant="separated">
        <AccordionItem id="item-5" title="Separated Variant">
          This variant has space between items instead of dividers.
        </AccordionItem>
        <AccordionItem id="item-6" title="Separated Variant">
          The content of the second item.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Accordion size="sm">
        <AccordionItem id="item-1" title="Small Size">
          This is the small size variant.
        </AccordionItem>
        <AccordionItem id="item-2" title="Small Size">
          The content of the second item.
        </AccordionItem>
      </Accordion>

      <Accordion size="md">
        <AccordionItem id="item-3" title="Medium Size">
          This is the medium size variant.
        </AccordionItem>
        <AccordionItem id="item-4" title="Medium Size">
          The content of the second item.
        </AccordionItem>
      </Accordion>

      <Accordion size="lg">
        <AccordionItem id="item-5" title="Large Size">
          This is the large size variant.
        </AccordionItem>
        <AccordionItem id="item-6" title="Large Size">
          The content of the second item.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple>
      <AccordionItem id="item-1" title="First Item">
        This accordion allows multiple items to be expanded at once.
      </AccordionItem>
      <AccordionItem id="item-2" title="Second Item">
        You can expand this item while keeping the first one open.
      </AccordionItem>
      <AccordionItem id="item-3" title="Third Item">
        And this one too!
      </AccordionItem>
    </Accordion>
  ),
};

export const WithStates: Story = {
  render: () => (
    <Accordion>
      <AccordionItem id="item-1" title="Normal Item">
        This is a normal accordion item.
      </AccordionItem>
      <AccordionItem id="item-2" title="Disabled Item" disabled>
        This item is disabled and cannot be expanded.
      </AccordionItem>
      <AccordionItem
        id="item-3"
        title="Item with End Icon"
        endIcon={<Star className="h-5 w-5 text-yellow-400" />}
      >
        This item has an icon at the end.
      </AccordionItem>
    </Accordion>
  ),
};

export const Complex: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Accordion variant="bordered" multiple>
        <AccordionItem
          id="item-1"
          title="Account Security"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
        >
          <div className="space-y-2">
            <h4 className="font-medium">Security Settings</h4>
            <p className="text-sm text-gray-500">
              Manage your account security settings, including password,
              two-factor authentication, and login history.
            </p>
            <div className="flex gap-2">
              <button className="rounded-md bg-primary px-3 py-1 text-sm text-white">
                Change Password
              </button>
              <button className="rounded-md border border-gray-300 px-3 py-1 text-sm">
                View Login History
              </button>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          id="item-2"
          title="Data Management"
          icon={<Trash className="h-5 w-5 text-gray-400" />}
        >
          <div className="space-y-2">
            <h4 className="font-medium">Data Settings</h4>
            <p className="text-sm text-gray-500">
              Manage your data, including export options, deletion requests, and
              data retention settings.
            </p>
            <div className="flex gap-2">
              <button className="rounded-md bg-primary px-3 py-1 text-sm text-white">
                Export Data
              </button>
              <button className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600">
                Delete Account
              </button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
