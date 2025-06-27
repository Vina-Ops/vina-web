import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chart } from "./charts";

const meta: Meta<typeof Chart> = {
  title: "UI/Charts",
  component: Chart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible charting component that supports various chart types using Recharts.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["line", "bar", "area", "pie"],
      description: "The type of chart to display",
    },
    showLegend: {
      control: "boolean",
      description: "Whether to show the legend",
    },
    showTooltip: {
      control: "boolean",
      description: "Whether to show tooltips on hover",
    },
    showGrid: {
      control: "boolean",
      description: "Whether to show the grid",
    },
    stacked: {
      control: "boolean",
      description: "Whether to stack the data (for bar and area charts)",
    },
    animationDuration: {
      control: "number",
      description: "Duration of the animation in milliseconds",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

// Sample data
const monthlyData = [
  { name: "Jan", sales: 4000, revenue: 2400, profit: 1800 },
  { name: "Feb", sales: 3000, revenue: 1398, profit: 1200 },
  { name: "Mar", sales: 2000, revenue: 9800, profit: 2800 },
  { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
  { name: "May", sales: 1890, revenue: 4800, profit: 2400 },
  { name: "Jun", sales: 2390, revenue: 3800, profit: 2200 },
];

const pieData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 300 },
  { name: "Product D", value: 200 },
];

export const LineChart: Story = {
  args: {
    type: "line",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    xAxisLabel: "Month",
    yAxisLabel: "Amount",
    valueFormatter: (value) => `$${value.toLocaleString()}`,
  },
};

export const BarChart: Story = {
  args: {
    type: "bar",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    xAxisLabel: "Month",
    yAxisLabel: "Amount",
    valueFormatter: (value) => `$${value.toLocaleString()}`,
  },
};

export const StackedBarChart: Story = {
  args: {
    type: "bar",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    stacked: true,
    xAxisLabel: "Month",
    yAxisLabel: "Amount",
    valueFormatter: (value) => `$${value.toLocaleString()}`,
  },
};

export const AreaChart: Story = {
  args: {
    type: "area",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    xAxisLabel: "Month",
    yAxisLabel: "Amount",
    valueFormatter: (value) => `$${value.toLocaleString()}`,
  },
};

export const StackedAreaChart: Story = {
  args: {
    type: "area",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    stacked: true,
    xAxisLabel: "Month",
    yAxisLabel: "Amount",
    valueFormatter: (value) => `$${value.toLocaleString()}`,
  },
};

export const PieChart: Story = {
  args: {
    type: "pie",
    data: pieData,
    dataKey: "value",
    height: 400,
    showLegend: true,
    showTooltip: true,
    valueFormatter: (value) => `${value} units`,
  },
};

export const CustomColors: Story = {
  args: {
    type: "bar",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    colors: ["#ef4444", "#10b981", "#3b82f6"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    xAxisLabel: "Month",
    yAxisLabel: "Amount",
    valueFormatter: (value) => `$${value.toLocaleString()}`,
  },
};

export const CustomTooltip: Story = {
  args: {
    type: "line",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    customTooltip: (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <h3 className="mb-2 font-semibold">Monthly Overview</h3>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Sales:</span>{" "}
            {monthlyData[0].sales.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Revenue:</span>{" "}
            {monthlyData[0].revenue.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Profit:</span>{" "}
            {monthlyData[0].profit.toLocaleString()}
          </p>
        </div>
      </div>
    ),
  },
};

export const NoAnimation: Story = {
  args: {
    type: "line",
    data: monthlyData,
    dataKey: "name",
    categories: ["sales", "revenue", "profit"],
    height: 400,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    animationDuration: 0,
  },
};
