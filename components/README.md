# Enhanced UI Components with Position Configuration

This document describes the enhanced UI components that now support flexible positioning configurations, especially optimized for mobile devices.

## Components

### 1. LanguageSwitcher

A dropdown component for selecting languages with smart positioning.

#### Props

```typescript
interface LanguageSwitcherProps {
  position?: PositionConfig;
  className?: string;
  compact?: boolean;
}

interface PositionConfig {
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  offset?: number;
  mobilePlacement?: "top" | "bottom" | "left" | "right" | "auto";
  mobileOffset?: number;
  maxWidth?: string;
  mobileMaxWidth?: string;
}
```

#### Usage Examples

```tsx
// Default (auto positioning)
<LanguageSwitcher />

// Top placement
<LanguageSwitcher
  position={{
    placement: 'top',
    offset: 12,
    mobilePlacement: 'bottom',
    mobileOffset: 8
  }}
/>

// Right placement with custom width
<LanguageSwitcher
  position={{
    placement: 'right',
    offset: 16,
    maxWidth: '220px'
  }}
/>

// Compact version
<LanguageSwitcher
  compact={true}
  position={{
    placement: 'bottom',
    mobilePlacement: 'top'
  }}
/>
```

### 2. ThemeToggle

A dropdown component for switching between light, dark, and system themes.

#### Props

```typescript
interface ThemeToggleProps {
  position?: PositionConfig;
  className?: string;
  compact?: boolean;
}
```

#### Usage Examples

```tsx
// Default
<ThemeToggle />

// Left placement
<ThemeToggle
  position={{
    placement: 'left',
    offset: 20,
    mobilePlacement: 'bottom'
  }}
/>

// Compact version
<ThemeToggle
  compact={true}
  position={{
    placement: 'top',
    mobilePlacement: 'bottom'
  }}
/>
```

### 3. TranslationPanel

A modal-like component for translation features with flexible positioning.

#### Props

```typescript
interface TranslationPanelProps {
  position?: PositionConfig;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}
```

#### Usage Examples

```tsx
// Center placement (default)
<TranslationPanel
  position={{
    placement: 'center',
    maxWidth: '600px',
    mobileMaxWidth: '95vw'
  }}
/>

// Top placement
<TranslationPanel
  position={{
    placement: 'top',
    mobilePlacement: 'center',
    maxHeight: '70vh'
  }}
/>

// Mobile optimized
<TranslationPanel
  position={{
    mobilePlacement: 'bottom',
    mobileMaxWidth: '100vw',
    mobileMaxHeight: '85vh'
  }}
/>
```

## Position Configuration

### Placement Options

- **`top`**: Position above the trigger element
- **`bottom`**: Position below the trigger element (default)
- **`left`**: Position to the left of the trigger element
- **`right`**: Position to the right of the trigger element
- **`auto`**: Automatically detect the best position based on available space
- **`center`**: Center the component in the viewport (for modals)

### Configuration Properties

- **`placement`**: Primary placement for desktop
- **`mobilePlacement`**: Override placement for mobile devices
- **`offset`**: Distance from trigger element (in pixels)
- **`mobileOffset`**: Override offset for mobile devices
- **`maxWidth`**: Maximum width of the dropdown/modal
- **`mobileMaxWidth`**: Override max width for mobile devices
- **`maxHeight`**: Maximum height (for modals)
- **`mobileMaxHeight`**: Override max height for mobile devices

## Mobile Optimizations

All components automatically detect mobile devices (viewport width < 768px) and apply mobile-specific optimizations:

### LanguageSwitcher

- Larger touch targets (48px vs 40px)
- Wider dropdown (280px vs 200px)
- Bottom placement by default
- Better spacing for touch interaction

### ThemeToggle

- Compact button size option
- Larger dropdown (200px vs 180px)
- Bottom placement by default
- Touch-friendly spacing

### TranslationPanel

- Full viewport width (95vw)
- Higher max height (90vh vs 80vh)
- Stacked button layout
- Better scroll handling

## Common Position Configurations

```typescript
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
```

## Best Practices

1. **Always provide mobile overrides** for critical positioning
2. **Use `auto` placement** when space is limited
3. **Test on different screen sizes** to ensure proper positioning
4. **Consider touch targets** on mobile (minimum 44px)
5. **Use appropriate offsets** to prevent overlap with other elements
6. **Leverage the compact prop** for space-constrained layouts

## Implementation Details

### Position Calculation

The components use `getBoundingClientRect()` to calculate the trigger element's position and determine the optimal placement for the dropdown/modal. The calculation considers:

- Available space in each direction
- Viewport boundaries
- Mobile-specific constraints
- Custom offset values

### Responsive Behavior

- Desktop: Uses `placement` and `offset` values
- Mobile: Uses `mobilePlacement` and `mobileOffset` values (with fallbacks)
- Automatic detection based on `window.innerWidth < 768`

### Performance

- Position calculations are throttled using `requestAnimationFrame`
- Recalculations only occur when necessary (window resize, position change)
- Efficient event listeners with proper cleanup

## Troubleshooting

### Common Issues

1. **Dropdown appears off-screen**: Check viewport boundaries and adjust offsets
2. **Mobile positioning incorrect**: Verify `mobilePlacement` and `mobileOffset` values
3. **Overlap with other elements**: Increase offset values or use different placement
4. **Performance issues**: Ensure proper cleanup of event listeners

### Debug Mode

Add `console.log` statements in the position calculation functions to debug positioning issues:

```typescript
console.log("Button rect:", buttonRect);
console.log("Viewport:", { width: viewportWidth, height: viewportHeight });
console.log("Calculated position:", newPosition);
```
