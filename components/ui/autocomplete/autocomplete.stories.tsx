import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete } from "./autocomplete";

const meta: Meta<typeof Autocomplete> = {
  title: "UI/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible autocomplete component with search, filtering, and keyboard navigation capabilities.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the autocomplete is disabled",
    },
    loading: {
      control: "boolean",
      description: "Whether the autocomplete is in a loading state",
    },
    clearable: {
      control: "boolean",
      description: "Whether the selected value can be cleared",
    },
    searchable: {
      control: "boolean",
      description: "Whether the input is searchable",
    },
    multiple: {
      control: "boolean",
      description: "Whether multiple values can be selected",
    },
    groupBy: {
      control: "boolean",
      description: "Whether to group options by their group property",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

// Sample options
const options = [
  { value: "react", label: "React", group: "Frontend" },
  { value: "vue", label: "Vue", group: "Frontend" },
  { value: "angular", label: "Angular", group: "Frontend" },
  { value: "node", label: "Node.js", group: "Backend" },
  { value: "python", label: "Python", group: "Backend" },
  { value: "java", label: "Java", group: "Backend" },
  { value: "typescript", label: "TypeScript", group: "Languages" },
  { value: "javascript", label: "JavaScript", group: "Languages" },
  { value: "php", label: "PHP", group: "Languages" },
];

export const Basic: Story = {
  args: {
    options,
    placeholder: "Select a technology...",
  },
};

export const WithValue: Story = {
  args: {
    options,
    value: "react",
    placeholder: "Select a technology...",
  },
};

export const Multiple: Story = {
  args: {
    options,
    multiple: true,
    placeholder: "Select technologies...",
  },
};

export const Grouped: Story = {
  args: {
    options,
    groupBy: true,
    placeholder: "Select a technology...",
  },
};

export const Disabled: Story = {
  args: {
    options,
    disabled: true,
    value: "react",
    placeholder: "Select a technology...",
  },
};

export const Loading: Story = {
  args: {
    options,
    loading: true,
    placeholder: "Select a technology...",
  },
};

export const WithError: Story = {
  args: {
    options,
    error: "Please select a technology",
    placeholder: "Select a technology...",
  },
};

export const NotSearchable: Story = {
  args: {
    options,
    searchable: false,
    placeholder: "Select a technology...",
  },
};

export const NotClearable: Story = {
  args: {
    options,
    clearable: false,
    value: "react",
    placeholder: "Select a technology...",
  },
};

export const CustomOption: Story = {
  args: {
    options,
    placeholder: "Select a technology...",
    customOption: (option) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary-500" />
        <span>{option.label}</span>
        <span className="ml-auto text-xs text-gray-500">{option.group}</span>
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Autocomplete
          options={options}
          value={value}
          onChange={setValue}
          placeholder="Select a technology..."
        />
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Selected value: {value || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const InteractiveMultiple: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[300px] space-y-4">
        <Autocomplete
          options={options}
          value={value}
          onChange={setValue}
          multiple
          placeholder="Select technologies..."
        />
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Selected values: {value || "None"}
          </p>
        </div>
      </div>
    );
  },
};
