import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import Button from "../button/button";
import { Input } from "../input/input";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component that can be used to group related content and actions.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "elevated", "ghost"],
      description: "Visual variant of the card",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the card",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic Card
export const Basic: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
};

// Card with Form
export const WithForm: Story = {
  render: (args) => (
    <Card {...args} className="w-[400px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="Enter your email" />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Create Account</Button>
      </CardFooter>
    </Card>
  ),
};

// Card with Image
export const WithImage: Story = {
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <img
        src="https://images.unsplash.com/photo-1522252234503-e356532cafd5"
        alt="Card cover"
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>Product Name</CardTitle>
        <CardDescription>$99.99</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          This is a brief description of the product. It can span multiple lines
          and provide more details about the item.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Card with Stats
export const WithStats: Story = {
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Monthly Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-2xl font-bold">567</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Growth</p>
            <p className="text-2xl font-bold text-green-600">+12.5%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Card with List
export const WithList: Story = {
  render: (args) => (
    <Card {...args} className="w-[300px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start space-x-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">Activity {item}</p>
                <p className="text-sm text-gray-500">
                  This is a description of activity {item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">
          View All
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Interactive Card
const InteractiveCard = (args: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      {...args}
      className={`w-[300px] transition-all duration-200 ${
        isHovered ? "scale-105" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          This card demonstrates interactive hover effects and animations.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

export const Interactive: Story = {
  render: InteractiveCard,
};
