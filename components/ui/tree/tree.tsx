import React from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeVariant = "default" | "bordered" | "compact";
export type TreeSize = "sm" | "md" | "lg";
export type TreeSelectionMode = "single" | "multiple" | "none";

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  selected?: boolean;
  expanded?: boolean;
  data?: any;
}

export interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the tree
   */
  variant?: TreeVariant;
  /**
   * The size of the tree nodes
   */
  size?: TreeSize;
  /**
   * The selection mode of the tree
   */
  selectionMode?: TreeSelectionMode;
  /**
   * The tree data
   */
  data: TreeNode[];
  /**
   * The default expanded nodes
   */
  defaultExpanded?: string[];
  /**
   * The default selected nodes
   */
  defaultSelected?: string[];
  /**
   * Callback when a node is expanded/collapsed
   */
  onExpand?: (nodeId: string, expanded: boolean) => void;
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (nodeId: string, selected: boolean) => void;
  /**
   * Whether to show the chevron icon
   */
  showChevron?: boolean;
  /**
   * Whether to show the default folder/file icons
   */
  showDefaultIcons?: boolean;
  /**
   * Whether to animate the chevron rotation
   */
  animateChevron?: boolean;
  /**
   * The indentation width in pixels
   */
  indentWidth?: number;
}

const variantStyles: Record<TreeVariant, string> = {
  default: "",
  bordered: "border border-gray-200 rounded-lg",
  compact: "space-y-0.5",
};

const sizeStyles: Record<TreeSize, { node: string; icon: string }> = {
  sm: {
    node: "py-1 px-2 text-sm",
    icon: "h-4 w-4",
  },
  md: {
    node: "py-2 px-3 text-base",
    icon: "h-5 w-5",
  },
  lg: {
    node: "py-3 px-4 text-lg",
    icon: "h-6 w-6",
  },
};

const TreeContext = React.createContext<{
  expandedNodes: Set<string>;
  selectedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
  selectNode: (nodeId: string) => void;
  selectionMode: TreeSelectionMode;
  size: TreeSize;
  showChevron: boolean;
  animateChevron: boolean;
  showDefaultIcons: boolean;
  indentWidth: number;
}>({
  expandedNodes: new Set(),
  selectedNodes: new Set(),
  toggleNode: () => {},
  selectNode: () => {},
  selectionMode: "none",
  size: "md",
  showChevron: true,
  animateChevron: true,
  showDefaultIcons: true,
  indentWidth: 20,
});

const TreeNode = React.forwardRef<
  HTMLDivElement,
  {
    node: TreeNode;
    level: number;
  }
>(({ node, level }, ref) => {
  const {
    expandedNodes,
    selectedNodes,
    toggleNode,
    selectNode,
    selectionMode,
    size,
    showChevron,
    animateChevron,
    showDefaultIcons,
    indentWidth,
  } = React.useContext(TreeContext);

  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      toggleNode(node.id);
    }
  };

  const handleSelect = () => {
    if (!node.disabled && selectionMode !== "none") {
      selectNode(node.id);
    }
  };

  return (
    <div ref={ref} style={{ marginLeft: level * indentWidth }}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md transition-colors",
          sizeStyles[size].node,
          !node.disabled && "cursor-pointer hover:bg-gray-100",
          isSelected && "bg-primary-50 text-primary-700",
          node.disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleSelect}
      >
        {hasChildren && showChevron && (
          <button
            type="button"
            className="flex-shrink-0"
            onClick={handleToggle}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown
                className={cn(
                  sizeStyles[size].icon,
                  "text-gray-400",
                  animateChevron && "transition-transform duration-200"
                )}
              />
            ) : (
              <ChevronRight
                className={cn(
                  sizeStyles[size].icon,
                  "text-gray-400",
                  animateChevron && "transition-transform duration-200"
                )}
              />
            )}
          </button>
        )}
        {node.icon ||
          (showDefaultIcons &&
            (hasChildren ? (
              <Folder className={cn(sizeStyles[size].icon, "text-gray-400")} />
            ) : (
              <File className={cn(sizeStyles[size].icon, "text-gray-400")} />
            )))}
        <span className="flex-grow">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = "TreeNode";

export const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      variant = "default",
      size = "md",
      selectionMode = "none",
      data,
      defaultExpanded = [],
      defaultSelected = [],
      onExpand,
      onNodeSelect,
      showChevron = true,
      showDefaultIcons = true,
      animateChevron = true,
      indentWidth = 20,
      className,
      ...props
    },
    ref
  ) => {
    const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
      new Set(defaultExpanded)
    );
    const [selectedNodes, setSelectedNodes] = React.useState<Set<string>>(
      new Set(defaultSelected)
    );

    const toggleNode = React.useCallback(
      (nodeId: string) => {
        setExpandedNodes((prev) => {
          const newExpanded = new Set(prev);
          if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
          } else {
            newExpanded.add(nodeId);
          }
          onExpand?.(nodeId, newExpanded.has(nodeId));
          return newExpanded;
        });
      },
      [onExpand]
    );

    const selectNode = React.useCallback(
      (nodeId: string) => {
        setSelectedNodes((prev) => {
          const newSelected = new Set(prev);
          if (selectionMode === "single") {
            newSelected.clear();
          }
          if (newSelected.has(nodeId)) {
            newSelected.delete(nodeId);
          } else {
            newSelected.add(nodeId);
          }
          onNodeSelect?.(nodeId, newSelected.has(nodeId));
          return newSelected;
        });
      },
      [selectionMode, onNodeSelect]
    );

    return (
      <TreeContext.Provider
        value={{
          expandedNodes,
          selectedNodes,
          toggleNode,
          selectNode,
          selectionMode,
          size,
          showChevron,
          animateChevron,
          showDefaultIcons,
          indentWidth,
        }}
      >
        <div
          ref={ref}
          role="tree"
          className={cn("w-full", variantStyles[variant], className)}
          {...props}
        >
          {data.map((node) => (
            <TreeNode key={node.id} node={node} level={0} />
          ))}
        </div>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = "Tree";
