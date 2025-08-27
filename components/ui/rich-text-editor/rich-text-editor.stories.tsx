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

// Interactive story component
const InteractiveEditorStory = () => {
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
};

export const Interactive: Story = {
  render: () => <InteractiveEditorStory />,
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

// Additional story examples for comprehensive testing
export const WithValidation: Story = {
  render: () => {
    const ValidationStory = () => {
      const [content, setContent] = useState("");
      const [error, setError] = useState("");

      const handleChange = (value: string) => {
        setContent(value);
        if (value.length < 10) {
          setError("Content must be at least 10 characters long");
        } else {
          setError("");
        }
      };

      return (
        <div className="space-y-2">
          <RichTextEditor
            content={content}
            onChange={handleChange}
            placeholder="Write at least 10 characters..."
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      );
    };

    return <ValidationStory />;
  },
};

export const MultipleEditors: Story = {
  render: () => {
    const MultipleEditorsStory = () => {
      const [content1, setContent1] = useState("");
      const [content2, setContent2] = useState("");

      return (
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-medium">Editor 1</h3>
            <RichTextEditor
              content={content1}
              onChange={setContent1}
              placeholder="First editor..."
            />
          </div>
          <div>
            <h3 className="mb-2 font-medium">Editor 2</h3>
            <RichTextEditor
              content={content2}
              onChange={setContent2}
              placeholder="Second editor..."
            />
          </div>
        </div>
      );
    };

    return <MultipleEditorsStory />;
  },
};