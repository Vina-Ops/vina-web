import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RichTextEditor } from "./rich-text-editor";

const meta: Meta<typeof RichTextEditor> = {
  title: "UI/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible rich text editor component with formatting options and toolbar.",
      },
    },
  },
  argTypes: {
    readOnly: {
      control: "boolean",
      description: "Whether the editor is read-only",
    },
    toolbar: {
      control: "boolean",
      description: "Whether to show the formatting toolbar",
    },
    minHeight: {
      control: "text",
      description: "Minimum height of the editor",
    },
    maxHeight: {
      control: "text",
      description: "Maximum height of the editor",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Basic: Story = {
  args: {
    placeholder: "Start typing...",
  },
};

export const WithContent: Story = {
  args: {
    content: `
      <h1>Welcome to the Rich Text Editor</h1>
      <p>This is a <strong>powerful</strong> editor that supports various formatting options.</p>
      <ul>
        <li>Bullet points</li>
        <li>Lists</li>
        <li>And more!</li>
      </ul>
    `,
  },
};

export const ReadOnly: Story = {
  args: {
    content: `
      <h1>Read Only Mode</h1>
      <p>This content cannot be edited.</p>
    `,
    readOnly: true,
    toolbar: false,
  },
};

export const WithoutToolbar: Story = {
  args: {
    placeholder: "Start typing...",
    toolbar: false,
  },
};

export const CustomHeight: Story = {
  args: {
    placeholder: "Start typing...",
    minHeight: "300px",
    maxHeight: "600px",
  },
};

export const CustomStyles: Story = {
  args: {
    placeholder: "Start typing...",
    className: "max-w-2xl",
    toolbarClassName: "bg-gray-50",
    editorClassName: "bg-gray-50",
  },
};

export const Interactive: Story = {
  render: () => {
    const [content, setContent] = useState("");

    return (
      <div className="space-y-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start typing..."
        />
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 font-medium">HTML Output:</h3>
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      </div>
    );
  },
};

export const WithInitialContent: Story = {
  args: {
    content: `
      <h1>Getting Started</h1>
      <p>Here are some <strong>key features</strong> of the editor:</p>
      <ul>
        <li>Text formatting (bold, italic, underline)</li>
        <li>Lists and indentation</li>
        <li>Text alignment</li>
        <li>Links and images</li>
        <li>Undo/redo support</li>
      </ul>
      <p>Try it out by <em>editing this content</em>!</p>
    `,
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: "Write your story here...",
  },
};
