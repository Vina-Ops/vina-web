import React from "react";
import { LanguageSwitcher } from "../language/LanguageSwitcher";
import { ThemeToggle } from "../theme/ThemeToggle";
import { TranslationPanel } from "../chat/TranslationPanel";

// Example usage of positioned selectors
export const PositionedSelectors = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Positioned Selectors Examples</h2>

      {/* Language Switcher Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Language Switcher</h3>

        {/* Default (auto positioning) */}
        <div className="flex items-center gap-4">
          <span>Default (auto):</span>
          <LanguageSwitcher />
        </div>

        {/* Top placement */}
        <div className="flex items-center gap-4">
          <span>Top placement:</span>
          <LanguageSwitcher
            position={{
              placement: "top",
              offset: 12,
              mobilePlacement: "bottom",
              mobileOffset: 8,
            }}
          />
        </div>

        {/* Right placement */}
        <div className="flex items-center gap-4">
          <span>Right placement:</span>
          <LanguageSwitcher
            position={{
              placement: "right",
              offset: 16,
              maxWidth: "220px",
            }}
          />
        </div>

        {/* Compact version */}
        <div className="flex items-center gap-4">
          <span>Compact:</span>
          <LanguageSwitcher
            compact={true}
            position={{
              placement: "bottom",
              mobilePlacement: "top",
            }}
          />
        </div>
      </div>

      {/* Theme Toggle Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Theme Toggle</h3>

        {/* Default */}
        <div className="flex items-center gap-4">
          <span>Default:</span>
          <ThemeToggle />
        </div>

        {/* Left placement */}
        <div className="flex items-center gap-4">
          <span>Left placement:</span>
          <ThemeToggle
            position={{
              placement: "left",
              offset: 20,
              mobilePlacement: "bottom",
            }}
          />
        </div>

        {/* Compact version */}
        <div className="flex items-center gap-4">
          <span>Compact:</span>
          <ThemeToggle
            compact={true}
            position={{
              placement: "top",
              mobilePlacement: "bottom",
            }}
          />
        </div>
      </div>

      {/* Translation Panel Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Translation Panel</h3>

        <div className="text-sm text-gray-600">
          The TranslationPanel supports different positioning modes:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Center (default)</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`position={{
  placement: 'center',
  maxWidth: '600px',
  mobileMaxWidth: '95vw'
}}`}
            </code>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Top placement</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`position={{
  placement: 'top',
  mobilePlacement: 'center',
  maxHeight: '70vh'
}}`}
            </code>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Mobile optimized</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`position={{
  mobilePlacement: 'bottom',
  mobileMaxWidth: '100vw',
  mobileMaxHeight: '85vh'
}}`}
            </code>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Side placement</h4>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`position={{
  placement: 'right',
  maxWidth: '500px',
  mobilePlacement: 'center'
}}`}
            </code>
          </div>
        </div>
      </div>

      {/* Mobile-specific examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mobile Optimizations</h3>

        <div className="text-sm text-gray-600 mb-4">
          All components automatically detect mobile devices and apply
          mobile-specific positioning:
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Language Switcher - Mobile</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
              <li>Larger touch targets</li>
              <li>Wider dropdown (280px vs 200px)</li>
              <li>Bottom placement by default</li>
              <li>Better spacing for touch interaction</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Theme Toggle - Mobile</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
              <li>Compact button size option</li>
              <li>Larger dropdown (200px vs 180px)</li>
              <li>Bottom placement by default</li>
              <li>Touch-friendly spacing</li>
            </ul>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Translation Panel - Mobile</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
              <li>Full viewport width (95vw)</li>
              <li>Higher max height (90vh vs 80vh)</li>
              <li>Stacked button layout</li>
              <li>Better scroll handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Common position configurations for reuse
export const PositionConfigs = {
  // For navigation bars
  navbar: {
    placement: "bottom" as const,
    mobilePlacement: "bottom" as const,
    offset: 8,
    mobileOffset: 8,
  },

  // For sidebars
  sidebar: {
    placement: "right" as const,
    mobilePlacement: "bottom" as const,
    offset: 12,
    mobileOffset: 8,
  },

  // For headers
  header: {
    placement: "bottom" as const,
    mobilePlacement: "top" as const,
    offset: 8,
    mobileOffset: 12,
  },

  // For modals/dialogs
  modal: {
    placement: "center" as const,
    mobilePlacement: "center" as const,
    maxWidth: "600px",
    mobileMaxWidth: "95vw",
    maxHeight: "80vh",
    mobileMaxHeight: "90vh",
  },

  // For compact spaces
  compact: {
    placement: "auto" as const,
    mobilePlacement: "bottom" as const,
    offset: 4,
    mobileOffset: 6,
    maxWidth: "160px",
    mobileMaxWidth: "200px",
  },
};
