import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Grid, GridItem } from "./grid";

const meta: Meta<typeof Grid> = {
  title: "UI/Grid",
  component: Grid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible grid system for creating responsive layouts with customizable columns, gaps, and alignments.",
      },
    },
  },
  argTypes: {
    cols: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: "Number of columns in the grid",
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Gap between grid items",
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
      description: "Vertical alignment of grid items",
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
      description: "Horizontal alignment of grid items",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

// Basic Grid
export const Basic: Story = {
  render: () => (
    <Grid cols={3} gap="md">
      {[1, 2, 3].map((item) => (
        <GridItem key={item}>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Item {item}</h3>
            <p>Basic grid item content</p>
          </div>
        </GridItem>
      ))}
    </Grid>
  ),
};

// Responsive Grid
export const Responsive: Story = {
  render: () => (
    <Grid cols={1} colsSm={2} colsMd={3} colsLg={4} gap="md">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <GridItem key={item}>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Item {item}</h3>
            <p>Responsive grid item</p>
          </div>
        </GridItem>
      ))}
    </Grid>
  ),
};

// Different Gaps
export const Gaps: Story = {
  render: () => (
    <div className="space-y-8">
      <Grid cols={3} gap="none">
        {[1, 2, 3].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">No Gap</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
      <Grid cols={3} gap="sm">
        {[1, 2, 3].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Small Gap</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
      <Grid cols={3} gap="lg">
        {[1, 2, 3].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Large Gap</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
    </div>
  ),
};

// Different Alignments
export const Alignments: Story = {
  render: () => (
    <div className="space-y-8">
      <Grid cols={3} gap="md" align="start">
        {[1, 2, 3].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Align Start</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
      <Grid cols={3} gap="md" align="center">
        {[1, 2, 3].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Align Center</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
      <Grid cols={3} gap="md" align="end">
        {[1, 2, 3].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Align End</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
    </div>
  ),
};

// Different Justifications
export const Justifications: Story = {
  render: () => (
    <div className="space-y-8">
      <Grid cols={3} gap="md" justify="start">
        {[1, 2].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Justify Start</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
      <Grid cols={3} gap="md" justify="center">
        {[1, 2].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Justify Center</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
      <Grid cols={3} gap="md" justify="between">
        {[1, 2].map((item) => (
          <GridItem key={item}>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Justify Between</h3>
              <p>Item {item}</p>
            </div>
          </GridItem>
        ))}
      </Grid>
    </div>
  ),
};

// Complex Layout
export const ComplexLayout: Story = {
  render: () => (
    <Grid cols={12} gap="md">
      <GridItem span={12}>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Header</h3>
          <p>Full width header section</p>
        </div>
      </GridItem>
      <GridItem span={3}>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Sidebar</h3>
          <p>Navigation menu</p>
        </div>
      </GridItem>
      <GridItem span={9}>
        <Grid cols={3} gap="md">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <GridItem key={item}>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Card {item}</h3>
                <p>Content card</p>
              </div>
            </GridItem>
          ))}
        </Grid>
      </GridItem>
      <GridItem span={12}>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Footer</h3>
          <p>Full width footer section</p>
        </div>
      </GridItem>
    </Grid>
  ),
};

// Nested Grids
export const NestedGrids: Story = {
  render: () => (
    <Grid cols={2} gap="md">
      <GridItem>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Parent Grid Item 1</h3>
          <Grid cols={2} gap="sm">
            {[1, 2, 3, 4].map((item) => (
              <GridItem key={item}>
                <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded">
                  <p>Nested Item {item}</p>
                </div>
              </GridItem>
            ))}
          </Grid>
        </div>
      </GridItem>
      <GridItem>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Parent Grid Item 2</h3>
          <Grid cols={1} gap="sm">
            {[1, 2].map((item) => (
              <GridItem key={item}>
                <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded">
                  <p>Nested Item {item}</p>
                </div>
              </GridItem>
            ))}
          </Grid>
        </div>
      </GridItem>
    </Grid>
  ),
};
