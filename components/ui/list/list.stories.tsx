import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { List, ListItem, ListGroup } from "./list";
import { User, Mail, Phone, ChevronRight, Star, Trash } from "lucide-react";

const meta: Meta<typeof List> = {
  title: "UI/List",
  component: List,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A List component that displays a collection of items in a structured format. It supports various visual styles, layouts, and interactive states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "striped", "hover"],
      description: "The visual variant of the list",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the list items",
    },
    layout: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "The layout direction of the list",
    },
    interactive: {
      control: "boolean",
      description: "Whether the list is interactive",
    },
    dividers: {
      control: "boolean",
      description: "Whether to show dividers between items",
    },
  },
};

export default meta;
type Story = StoryObj<typeof List>;

const sampleItems = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "234-567-8901",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "345-678-9012",
  },
];

export const Basic: Story = {
  render: () => (
    <List>
      {sampleItems.map((item) => (
        <ListItem key={item.id}>{item.name}</ListItem>
      ))}
    </List>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <List>
      {sampleItems.map((item) => (
        <ListItem
          key={item.id}
          icon={<User className="h-5 w-5 text-gray-400" />}
          endIcon={<ChevronRight className="h-5 w-5 text-gray-400" />}
        >
          {item.name}
        </ListItem>
      ))}
    </List>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <List variant="default">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
      <List variant="bordered">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
      <List variant="striped">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
      <List variant="hover">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <List size="sm">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
      <List size="md">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
      <List size="lg">
        {sampleItems.map((item) => (
          <ListItem key={item.id}>{item.name}</ListItem>
        ))}
      </List>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <List layout="horizontal">
      {sampleItems.map((item) => (
        <ListItem key={item.id}>{item.name}</ListItem>
      ))}
    </List>
  ),
};

export const Interactive: Story = {
  render: () => (
    <List interactive>
      {sampleItems.map((item) => (
        <ListItem
          key={item.id}
          icon={<User className="h-5 w-5 text-gray-400" />}
          endIcon={<ChevronRight className="h-5 w-5 text-gray-400" />}
        >
          {item.name}
        </ListItem>
      ))}
    </List>
  ),
};

export const WithStates: Story = {
  render: () => (
    <List>
      <ListItem selected>Selected Item</ListItem>
      <ListItem disabled>Disabled Item</ListItem>
      <ListItem>Normal Item</ListItem>
    </List>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ListGroup title="Contact Information">
        <List>
          {sampleItems.map((item) => (
            <ListItem
              key={item.id}
              icon={<User className="h-5 w-5 text-gray-400" />}
            >
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">{item.email}</span>
              </div>
            </ListItem>
          ))}
        </List>
      </ListGroup>
    </div>
  ),
};

export const Complex: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ListGroup title="Favorites" description="Your favorite contacts">
        <List variant="bordered">
          {sampleItems.map((item) => (
            <ListItem
              key={item.id}
              icon={<User className="h-5 w-5 text-gray-400" />}
              endIcon={
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Trash className="h-5 w-5 text-red-400" />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {item.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {item.phone}
                  </span>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </ListGroup>

      <ListGroup
        title="Recent Contacts"
        description="Recently contacted people"
      >
        <List variant="striped" interactive>
          {sampleItems.map((item) => (
            <ListItem
              key={item.id}
              icon={<User className="h-5 w-5 text-gray-400" />}
              endIcon={<ChevronRight className="h-5 w-5 text-gray-400" />}
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      </ListGroup>
    </div>
  ),
};
