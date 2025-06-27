import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  Share,
} from "lucide-react";
import { ActionButton } from "./action-button";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof ActionButton> = {
  title: "Components/ActionButton",
  component: ActionButton,
  parameters: {
    docs: {
      description: {
        component:
          "Action buttons for table rows and other interactive elements.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["ghost", "primary", "danger"],
      description: "Visual variant of the button",
    },
    label: {
      control: "text",
      description: "Tooltip label for the button",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;

const Template: StoryFn<typeof ActionButton> = (args) => (
  <ActionButton {...args} />
);

export const Ghost = Template.bind({});
Ghost.args = {
  icon: Eye,
  label: "View",
  variant: "ghost",
};

export const Primary = Template.bind({});
Primary.args = {
  icon: Edit,
  label: "Edit",
  variant: "primary",
};

export const Danger = Template.bind({});
Danger.args = {
  icon: Trash2,
  label: "Delete",
  variant: "danger",
};

export const ActionGroup = () => (
  <div className="flex items-center gap-1">
    <ActionButton icon={Eye} label="View" variant="ghost" />
    <ActionButton icon={Edit} label="Edit" variant="primary" />
    <ActionButton icon={Download} label="Download" variant="ghost" />
    <ActionButton icon={Share} label="Share" variant="ghost" />
    <ActionButton icon={Trash2} label="Delete" variant="danger" />
    <ActionButton icon={MoreHorizontal} label="More" variant="ghost" />
  </div>
);
