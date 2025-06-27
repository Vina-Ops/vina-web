import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "UI/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A FileUpload component that allows users to upload files through drag and drop or file selection. It supports various file types, multiple files, and file size limits.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error"],
      description: "The visual variant of the file upload",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the file upload",
    },
    disabled: {
      control: "boolean",
      description: "Whether the file upload is disabled",
    },
    error: {
      control: "boolean",
      description: "Whether the file upload is in an error state",
    },
    multiple: {
      control: "boolean",
      description: "Whether to allow multiple file uploads",
    },
    showPreview: {
      control: "boolean",
      description: "Whether to show the file preview",
    },
    showFileSize: {
      control: "boolean",
      description: "Whether to show the file size",
    },
    showFileType: {
      control: "boolean",
      description: "Whether to show the file type",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Basic: Story = {
  args: {
    label: "Upload Files",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Upload Files",
    helperText: "Upload your documents here",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FileUpload label="Default Upload" variant="default" />
      <FileUpload label="Primary Upload" variant="primary" />
      <FileUpload label="Success Upload" variant="success" />
      <FileUpload label="Warning Upload" variant="warning" />
      <FileUpload label="Error Upload" variant="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FileUpload label="Small Upload" size="sm" />
      <FileUpload label="Medium Upload" size="md" />
      <FileUpload label="Large Upload" size="lg" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "Upload Files",
    error: true,
    errorMessage: "Please upload a valid file",
  },
};

export const Disabled: Story = {
  args: {
    label: "Upload Files",
    disabled: true,
  },
};

export const MultipleFiles: Story = {
  args: {
    label: "Upload Files",
    multiple: true,
    maxFiles: 5,
  },
};

export const ImageUpload: Story = {
  args: {
    label: "Upload Images",
    accept: "image/*",
    helperText: "Upload images in PNG, JPG, or GIF format",
  },
};

export const DocumentUpload: Story = {
  args: {
    label: "Upload Documents",
    accept: ".pdf,.doc,.docx",
    helperText: "Upload PDF or Word documents",
  },
};

export const WithMaxSize: Story = {
  args: {
    label: "Upload Files",
    maxSize: 5 * 1024 * 1024, // 5MB
    helperText: "Maximum file size: 5MB",
  },
};

export const WithoutPreview: Story = {
  args: {
    label: "Upload Files",
    showPreview: false,
  },
};

export const Complex: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FileUpload
        label="Profile Picture"
        variant="primary"
        accept="image/*"
        maxSize={2 * 1024 * 1024}
        helperText="Upload a profile picture (max 2MB)"
        showPreview
        showFileSize
        showFileType
      />

      <FileUpload
        label="Documents"
        variant="success"
        multiple
        maxFiles={3}
        accept=".pdf,.doc,.docx"
        helperText="Upload up to 3 documents"
        showPreview
        showFileSize
        showFileType
      />

      <FileUpload
        label="Required Files"
        variant="error"
        error={true}
        errorMessage="Please upload the required files"
        accept=".pdf,.doc,.docx,.jpg,.png"
        helperText="Upload required documents and images"
        showPreview
        showFileSize
        showFileType
      />
    </div>
  ),
};
