import React from "react";
import { LucideIcon } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "outline"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "ghost"
  | "ghost-primary"
  | "ghost-success"
  | "ghost-danger"
  | "link"
  | "gradient"
  | "gradient-success"
  | "gradient-danger";

export type ButtonSize =
  | "extra-small"
  | "small"
  | "medium"
  | "large"
  | "extra-large";

// Button Component
const Button = ({
  variant = "primary" as ButtonVariant,
  size = "medium" as ButtonSize,
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  className = "",
  onClick,
  type = "button",
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    warning:
      "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 shadow-sm hover:shadow-md",

    outline:
      "border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500",
    "outline-secondary":
      "border-2 border-gray-600 text-gray-600 bg-transparent hover:bg-gray-50 focus:ring-gray-500",
    "outline-success":
      "border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-50 focus:ring-green-500",
    "outline-danger":
      "border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-50 focus:ring-red-500",

    ghost: "text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500",
    "ghost-primary":
      "text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500",
    "ghost-success":
      "text-green-600 bg-transparent hover:bg-green-50 focus:ring-green-500",
    "ghost-danger":
      "text-red-600 bg-transparent hover:bg-red-50 focus:ring-red-500",

    link: "text-blue-600 bg-transparent hover:text-blue-700 hover:underline focus:ring-blue-500 p-0",

    gradient:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
    "gradient-success":
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 shadow-lg hover:shadow-xl",
    "gradient-danger":
      "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
  };

  const sizes = {
    "extra-small": "px-2 py-1 text-xs gap-1",
    small: "px-3 py-1.5 text-sm gap-1.5",
    medium: "px-4 py-2 text-sm gap-2",
    large: "px-6 py-3 text-base gap-2",
    "extra-large": "px-8 py-4 text-lg gap-3",
  };

  const iconSizes = {
    "extra-small": 12,
    small: 14,
    medium: 16,
    large: 18,
    "extra-large": 20,
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${variant !== "link" ? sizes[size] : "gap-1"}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const iconSize = iconSizes[size];
  const showIcon = Icon && !loading;
  const showSpinner = loading;

  const Spinner = () => (
    <div className="animate-spin">
      <div
        className={`border-2 border-current border-t-transparent rounded-full`}
        style={{
          width: iconSize,
          height: iconSize,
        }}
      />
    </div>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {showSpinner && <Spinner />}
      {showIcon && iconPosition === "left" && <Icon size={iconSize} />}
      {children && <span>{children}</span>}
      {showIcon && iconPosition === "right" && <Icon size={iconSize} />}
    </button>
  );
};

// Demo Component with Storybook-like interface
// const ButtonDemo = () => {
//   const [activeTab, setActiveTab] = React.useState("variants");

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Button Component
//           </h1>
//           <p className="text-lg text-gray-600">
//             Flexible, reusable button with multiple variants and optional icons
//           </p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8 justify-center">
//             {[
//               { id: "variants", label: "Variants" },
//               { id: "sizes", label: "Sizes" },
//               { id: "icons", label: "With Icons" },
//               { id: "states", label: "States" },
//               { id: "examples", label: "Examples" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Variants Tab */}
//         {activeTab === "variants" && (
//           <div className="space-y-8">
//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Solid Variants</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button variant="primary">Primary</Button>
//                 <Button variant="secondary">Secondary</Button>
//                 <Button variant="success">Success</Button>
//                 <Button variant="danger">Danger</Button>
//                 <Button variant="warning">Warning</Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Outline Variants</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button variant="outline">Outline</Button>
//                 <Button variant="outline-secondary">Outline Secondary</Button>
//                 <Button variant="outline-success">Outline Success</Button>
//                 <Button variant="outline-danger">Outline Danger</Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Ghost Variants</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button variant="ghost">Ghost</Button>
//                 <Button variant="ghost-primary">Ghost Primary</Button>
//                 <Button variant="ghost-success">Ghost Success</Button>
//                 <Button variant="ghost-danger">Ghost Danger</Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Special Variants</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button variant="link">Link Button</Button>
//                 <Button variant="gradient">Gradient</Button>
//                 <Button variant="gradient-success">Gradient Success</Button>
//                 <Button variant="gradient-danger">Gradient Danger</Button>
//               </div>
//             </section>
//           </div>
//         )}

//         {/* Sizes Tab */}
//         {activeTab === "sizes" && (
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-6">Button Sizes</h2>
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <Button size="extra-small" variant="primary">
//                   Extra Small
//                 </Button>
//                 <code className="text-sm text-gray-600">
//                   size="extra-small"
//                 </code>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Button size="small" variant="primary">
//                   Small
//                 </Button>
//                 <code className="text-sm text-gray-600">size="small"</code>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Button size="medium" variant="primary">
//                   Medium (Default)
//                 </Button>
//                 <code className="text-sm text-gray-600">size="medium"</code>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Button size="large" variant="primary">
//                   Large
//                 </Button>
//                 <code className="text-sm text-gray-600">size="large"</code>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Button size="extra-large" variant="primary">
//                   Extra Large
//                 </Button>
//                 <code className="text-sm text-gray-600">
//                   size="extra-large"
//                 </code>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Icons Tab */}
//         {activeTab === "icons" && (
//           <div className="space-y-8">
//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Icons on Left</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button icon={Plus} variant="primary">
//                   Add Item
//                 </Button>
//                 <Button icon={Download} variant="secondary">
//                   Download
//                 </Button>
//                 <Button icon={Edit} variant="outline">
//                   Edit
//                 </Button>
//                 <Button icon={Trash2} variant="outline-danger">
//                   Delete
//                 </Button>
//                 <Button icon={Save} variant="success">
//                   Save
//                 </Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Icons on Right</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button
//                   icon={ArrowRight}
//                   iconPosition="right"
//                   variant="primary"
//                 >
//                   Continue
//                 </Button>
//                 <Button
//                   icon={ArrowRight}
//                   iconPosition="right"
//                   variant="outline"
//                 >
//                   Next Step
//                 </Button>
//                 <Button icon={Upload} iconPosition="right" variant="success">
//                   Upload File
//                 </Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Icon Only Buttons</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button icon={Eye} variant="ghost" size="medium" />
//                 <Button icon={Edit} variant="ghost-primary" size="medium" />
//                 <Button icon={Trash2} variant="ghost-danger" size="medium" />
//                 <Button icon={Share} variant="outline" size="medium" />
//                 <Button icon={Settings} variant="primary" size="medium" />
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">
//                 Different Icon Sizes
//               </h2>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <Button icon={Plus} size="extra-small" variant="primary">
//                     Extra Small
//                   </Button>
//                   <Button icon={Plus} size="small" variant="primary">
//                     Small
//                   </Button>
//                   <Button icon={Plus} size="medium" variant="primary">
//                     Medium
//                   </Button>
//                   <Button icon={Plus} size="large" variant="primary">
//                     Large
//                   </Button>
//                   <Button icon={Plus} size="extra-large" variant="primary">
//                     Extra Large
//                   </Button>
//                 </div>
//               </div>
//             </section>
//           </div>
//         )}

//         {/* States Tab */}
//         {activeTab === "states" && (
//           <div className="space-y-8">
//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Loading States</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button loading variant="primary">
//                   Loading...
//                 </Button>
//                 <Button loading variant="secondary">
//                   Processing
//                 </Button>
//                 <Button loading variant="outline">
//                   Saving
//                 </Button>
//                 <Button loading icon={Save} variant="success">
//                   Save
//                 </Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Disabled States</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Button disabled variant="primary">
//                   Disabled
//                 </Button>
//                 <Button disabled variant="secondary">
//                   Disabled
//                 </Button>
//                 <Button disabled variant="outline">
//                   Disabled
//                 </Button>
//                 <Button disabled icon={Plus} variant="success">
//                   Disabled
//                 </Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Full Width</h2>
//               <div className="space-y-4 max-w-md">
//                 <Button fullWidth variant="primary">
//                   Full Width Primary
//                 </Button>
//                 <Button fullWidth variant="outline" icon={Download}>
//                   Full Width with Icon
//                 </Button>
//                 <Button fullWidth loading variant="secondary">
//                   Full Width Loading
//                 </Button>
//               </div>
//             </section>
//           </div>
//         )}

//         {/* Examples Tab */}
//         {activeTab === "examples" && (
//           <div className="space-y-8">
//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">
//                 Common Button Groups
//               </h2>
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="font-medium mb-3">Form Actions</h3>
//                   <div className="flex gap-3">
//                     <Button icon={Save} variant="primary">
//                       Save Changes
//                     </Button>
//                     <Button variant="outline">Cancel</Button>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium mb-3">CRUD Operations</h3>
//                   <div className="flex gap-3">
//                     <Button icon={Plus} variant="primary">
//                       Create New
//                     </Button>
//                     <Button icon={Edit} variant="outline">
//                       Edit
//                     </Button>
//                     <Button icon={Eye} variant="ghost">
//                       View
//                     </Button>
//                     <Button icon={Trash2} variant="outline-danger">
//                       Delete
//                     </Button>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium mb-3">Navigation</h3>
//                   <div className="flex gap-3">
//                     <Button icon={ArrowLeft} variant="outline">
//                       Previous
//                     </Button>
//                     <Button
//                       icon={ArrowRight}
//                       iconPosition="right"
//                       variant="primary"
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="font-medium mb-3">File Operations</h3>
//                   <div className="flex gap-3">
//                     <Button icon={Upload} variant="primary">
//                       Upload
//                     </Button>
//                     <Button icon={Download} variant="secondary">
//                       Download
//                     </Button>
//                     <Button icon={Share} variant="outline">
//                       Share
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">
//                 E-commerce Examples
//               </h2>
//               <div className="space-y-4">
//                 <div className="flex gap-3">
//                   <Button icon={ShoppingCart} variant="gradient" size="large">
//                     Add to Cart
//                   </Button>
//                   <Button icon={Heart} variant="outline" size="large" />
//                 </div>
//                 <div className="flex gap-3">
//                   <Button
//                     fullWidth
//                     icon={ShoppingCart}
//                     variant="primary"
//                     size="large"
//                   >
//                     Buy Now
//                   </Button>
//                 </div>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Social Actions</h2>
//               <div className="flex gap-3">
//                 <Button icon={Mail} variant="primary">
//                   Email
//                 </Button>
//                 <Button icon={Phone} variant="success">
//                   Call
//                 </Button>
//                 <Button icon={Share} variant="outline">
//                   Share
//                 </Button>
//                 <Button icon={Star} variant="warning">
//                   Favorite
//                 </Button>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-lg shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">Toolbar Actions</h2>
//               <div className="flex gap-2">
//                 <Button icon={Search} variant="ghost" size="small" />
//                 <Button icon={Filter} variant="ghost" size="small" />
//                 <Button icon={Settings} variant="ghost" size="small" />
//                 <Button icon={Bell} variant="ghost" size="small" />
//                 <Button icon={User} variant="ghost" size="small" />
//               </div>
//             </section>
//           </div>
//         )}

//         {/* Usage Examples */}
//         <section className="bg-gray-900 text-white p-6 rounded-lg">
//           <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
//           <div className="space-y-4 text-sm">
//             <div>
//               <div className="text-gray-300 mb-2">Basic button:</div>
//               <code className="bg-gray-800 p-2 rounded block">{`<Button variant="primary">Click me</Button>`}</code>
//             </div>
//             <div>
//               <div className="text-gray-300 mb-2">With icon:</div>
//               <code className="bg-gray-800 p-2 rounded block">{`<Button icon={Plus} variant="primary">Add Item</Button>`}</code>
//             </div>
//             <div>
//               <div className="text-gray-300 mb-2">Loading state:</div>
//               <code className="bg-gray-800 p-2 rounded block">{`<Button loading variant="primary">Saving...</Button>`}</code>
//             </div>
//             <div>
//               <div className="text-gray-300 mb-2">
//                 Full width with right icon:
//               </div>
//               <code className="bg-gray-800 p-2 rounded block">{`<Button fullWidth icon={ArrowRight} iconPosition="right" variant="gradient">Continue</Button>`}</code>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

export default Button;
