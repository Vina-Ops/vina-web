// Input.stories.tsx
import React from "react";
import { Input, SearchInput, FormGroup } from "./input";
import {
  Search,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

interface FormData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface SearchResult {
  title: string;
  subtitle: string;
}

// Fix 1: Assign to variable before exporting
const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A comprehensive input component with multiple variants, states, and features including icons, validation, and accessibility support.",
      },
    },
  },
  argTypes: {
    type: {
      control: { type: "select" },
      options: [
        "text",
        "email",
        "password",
        "tel",
        "url",
        "search",
        "number",
        "date",
      ],
      description: "Input type",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "outlined", "filled", "underlined", "ghost"],
      description: "Visual variant of the input",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Size of the input",
    },
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
      description: "Position of the icon",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    required: {
      control: "boolean",
      description: "Whether the input is required",
    },
    success: {
      control: "boolean",
      description: "Whether to show success state",
    },
    clearable: {
      control: "boolean",
      description: "Whether the input can be cleared",
    },
  },
};

export default meta;

// Basic Input Stories
export const Default = {
  args: {
    placeholder: "Enter text...",
    label: "Default Input",
  },
};

export const WithLabel = {
  args: {
    placeholder: "Enter your name",
    label: "Full Name",
    helperText: "Please enter your full name",
  },
};

export const Required = {
  args: {
    placeholder: "Enter email",
    label: "Email Address",
    required: true,
    type: "email",
  },
};

export const WithHelperText = {
  args: {
    placeholder: "Enter password",
    label: "Password",
    helperText: "Password must be at least 8 characters long",
    type: "password",
  },
};

// Variant Stories
export const Variants = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input placeholder="Default variant" variant="default" label="Default" />
      <Input
        placeholder="Outlined variant"
        variant="outlined"
        label="Outlined"
      />
      <Input placeholder="Filled variant" variant="filled" label="Filled" />
      <Input
        placeholder="Underlined variant"
        variant="underlined"
        label="Underlined"
      />
      <Input placeholder="Ghost variant" variant="ghost" label="Ghost" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different visual variants of the input component.",
      },
    },
  },
};

// Size Stories
export const Sizes = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input placeholder="Small input" size="small" label="Small" />
      <Input placeholder="Medium input" size="medium" label="Medium" />
      <Input placeholder="Large input" size="large" label="Large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes available for the input component.",
      },
    },
  },
};

// State Stories
export const States = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <Input
        placeholder="Normal state"
        label="Normal"
        helperText="This is helper text"
      />
      <Input
        placeholder="Success state"
        label="Success"
        success={true}
        helperText="Valid input"
      />
      <Input
        placeholder="Error state"
        label="Error"
        error="This field is required"
      />
      <Input
        placeholder="Disabled state"
        label="Disabled"
        disabled={true}
        value="Disabled"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different states of the input component including normal, success, error, and disabled.",
      },
    },
  },
};

// Icon Stories
export const WithIcons = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <Input
        placeholder="Enter name"
        label="Name"
        icon={User}
        iconPosition="left"
      />
      <Input
        placeholder="Enter email"
        label="Email"
        icon={Mail}
        iconPosition="left"
        type="email"
      />
      <Input
        placeholder="Enter phone"
        label="Phone"
        icon={Phone}
        iconPosition="left"
        type="tel"
      />
      <Input
        placeholder="Enter amount"
        label="Amount"
        icon={DollarSign}
        iconPosition="left"
      />
      <Input
        placeholder="Select date"
        label="Date"
        icon={Calendar}
        iconPosition="right"
        type="date"
      />
      <Input
        placeholder="Enter location"
        label="Location"
        icon={MapPin}
        iconPosition="right"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input components with various icons in different positions.",
      },
    },
  },
};

// Password Input
export const PasswordInput = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        placeholder="Enter password"
        label="Password"
        type="password"
        helperText="Password will be hidden"
      />
      <Input
        placeholder="Confirm password"
        label="Confirm Password"
        type="password"
        variant="outlined"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Password inputs with toggle visibility functionality.",
      },
    },
  },
};

// Fix 2: Create proper React components for stories with state
const ClearableInputStory = () => {
  const [value, setValue] = React.useState("This text can be cleared");
  
  return (
    <div className="max-w-md">
      <Input
        placeholder="Type something..."
        label="Clearable Input"
        clearable={true}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        helperText="Click the X to clear the input"
      />
    </div>
  );
};

// Clearable Input
export const ClearableInput = {
  render: () => <ClearableInputStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Input with clearable functionality - shows an X button when there is content.",
      },
    },
  },
};

// Search Input Stories
export const SearchInputBasic = {
  render: () => (
    <div className="max-w-md">
      <SearchInput placeholder="Search products..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic search input with search icon.",
      },
    },
  },
};

const SearchWithResultsStory = () => {
  const searchResults: SearchResult[] = [
    { title: "Apple iPhone 14", subtitle: "Electronics > Smartphones" },
    { title: "Apple MacBook Pro", subtitle: "Electronics > Laptops" },
    { title: "Apple Watch Series 8", subtitle: "Electronics > Wearables" },
    { title: "AirPods Pro", subtitle: "Electronics > Audio" },
  ];

  return (
    <div className="max-w-md">
      <SearchInput
        placeholder="Search Apple products..."
        showResults={true}
        results={searchResults}
        onResultClick={(result: SearchResult) =>
          console.log("Selected:", result)
        }
      />
    </div>
  );
};

export const SearchWithResults = {
  render: () => <SearchWithResultsStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Search input with dropdown results. Type to see the dropdown appear.",
      },
    },
  },
};

export const SearchVariants = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <SearchInput placeholder="Default search" variant="default" />
      <SearchInput placeholder="Outlined search" variant="outlined" />
      <SearchInput placeholder="Filled search" variant="filled" />
      <SearchInput placeholder="Ghost search" variant="ghost" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Search input in different visual variants.",
      },
    },
  },
};

// Form Examples with proper React components
const ContactFormStory = () => {
  const [formData, setFormData] = React.useState<FormData>({});

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Contact Form</h3>
      <FormGroup>
        <Input
          placeholder="John Doe"
          label="Full Name"
          icon={User}
          required={true}
          value={formData.name || ""}
          onChange={handleChange("name")}
        />
        <Input
          placeholder="john@example.com"
          label="Email Address"
          icon={Mail}
          type="email"
          required={true}
          value={formData.email || ""}
          onChange={handleChange("email")}
        />
        <Input
          placeholder="+1 (555) 123-4567"
          label="Phone Number"
          icon={Phone}
          type="tel"
          value={formData.phone || ""}
          onChange={handleChange("phone")}
        />
      </FormGroup>
    </div>
  );
};

export const ContactForm = {
  render: () => <ContactFormStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Example contact form using the Input component with various field types.",
      },
    },
  },
};

const LoginFormStory = () => {
  const [formData, setFormData] = React.useState<FormData>({});

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Login Form</h3>
      <FormGroup>
        <Input
          placeholder="Enter your email"
          label="Email"
          icon={Mail}
          type="email"
          variant="outlined"
          required={true}
          value={formData.email || ""}
          onChange={handleChange("email")}
        />
        <Input
          placeholder="Enter your password"
          label="Password"
          type="password"
          variant="outlined"
          required={true}
          value={formData.password || ""}
          onChange={handleChange("password")}
        />
      </FormGroup>
    </div>
  );
};

export const LoginForm = {
  render: () => <LoginFormStory />,
  parameters: {
    docs: {
      description: {
        story: "Example login form with email and password fields.",
      },
    },
  },
};

// Playground Story
export const Playground = {
  args: {
    placeholder: "Customize me...",
    label: "Playground Input",
    helperText: "Try different props in the controls panel",
    type: "text",
    variant: "default",
    size: "medium",
    disabled: false,
    required: false,
    success: false,
    clearable: false,
    iconPosition: "left",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground to test different combinations of props.",
      },
    },
  },
};