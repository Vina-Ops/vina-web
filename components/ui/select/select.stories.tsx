import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible select component that supports single and multiple selections, search, and custom styling.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the select input",
    },
    variant: {
      control: "select",
      options: ["default", "bordered", "ghost"],
      description: "Visual variant of the select input",
    },
    disabled: {
      control: "boolean",
      description: "Whether the select is disabled",
    },
    required: {
      control: "boolean",
      description: "Whether the select is required",
    },
    multiple: {
      control: "boolean",
      description: "Whether multiple options can be selected",
    },
    searchable: {
      control: "boolean",
      description: "Whether the select is searchable",
    },
    clearable: {
      control: "boolean",
      description: "Whether the select can be cleared",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "disabled", label: "Disabled Option", disabled: true },
];

// Basic Select
export const Basic: Story = {
  args: {
    options,
    placeholder: "Select a fruit",
    label: "Fruit",
  },
};

// Multiple Select
export const Multiple: Story = {
  args: {
    options,
    placeholder: "Select fruits",
    label: "Fruits",
    multiple: true,
  },
};

// Searchable Select
export const Searchable: Story = {
  args: {
    options,
    placeholder: "Search and select a fruit",
    label: "Searchable Fruit",
    searchable: true,
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    options,
    placeholder: "Select a fruit",
    label: "Fruit",
    helperText: "Choose your favorite fruit from the list",
  },
};

// With Error
export const WithError: Story = {
  args: {
    options,
    placeholder: "Select a fruit",
    label: "Fruit",
    error: "Please select a fruit",
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    options,
    placeholder: "Select a fruit",
    label: "Fruit",
    disabled: true,
  },
};

// Required
export const Required: Story = {
  args: {
    options,
    placeholder: "Select a fruit",
    label: "Fruit",
    required: true,
  },
};

// Clearable
export const Clearable: Story = {
  args: {
    options,
    placeholder: "Select a fruit",
    label: "Fruit",
    clearable: true,
  },
};

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Select
        options={options}
        placeholder="Small select"
        label="Small"
        size="sm"
      />
      <Select
        options={options}
        placeholder="Medium select"
        label="Medium"
        size="md"
      />
      <Select
        options={options}
        placeholder="Large select"
        label="Large"
        size="lg"
      />
    </div>
  ),
};

// Different Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Select
        options={options}
        placeholder="Default variant"
        label="Default"
        variant="default"
      />
      <Select
        options={options}
        placeholder="Bordered variant"
        label="Bordered"
        variant="bordered"
      />
      <Select
        options={options}
        placeholder="Ghost variant"
        label="Ghost"
        variant="ghost"
      />
    </div>
  ),
};

// Complex Example
export const Complex: Story = {
  args: {
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "es", label: "Spain" },
      { value: "it", label: "Italy" },
      { value: "jp", label: "Japan" },
      { value: "kr", label: "South Korea" },
      { value: "cn", label: "China" },
      { value: "in", label: "India" },
      { value: "br", label: "Brazil" },
      { value: "mx", label: "Mexico" },
      { value: "za", label: "South Africa" },
    ],
    placeholder: "Select countries",
    label: "Countries",
    multiple: true,
    searchable: true,
    clearable: true,
    helperText: "Select one or more countries",
  },
};
