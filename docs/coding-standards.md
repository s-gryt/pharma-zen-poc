# Coding Standards and Style Guide

## TypeScript Guidelines

### Strict Configuration
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "exactOptionalPropertyTypes": true
}
```

### Type Definitions
```typescript
// ✅ Explicit interface definitions
interface ProductProps {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly onSelect?: (id: string) => void;
}

// ✅ Proper generic constraints
interface ApiResponse<T extends Record<string, unknown>> {
  readonly data: T;
  readonly status: number;
  readonly message: string;
}

// ❌ Avoid any type
const handleData = (data: any) => { ... }

// ✅ Use proper typing
const handleData = (data: unknown): void => {
  if (typeof data === 'object' && data !== null) {
    // Type guard logic
  }
}
```

### Function Naming (Elegant Objects Convention)
```typescript
// ✅ Noun-based method names (what, not how)
class ProductService {
  // Returns products, doesn't "get" them
  products(): Promise<Product[]> { ... }
  
  // Returns filtered products
  filteredProducts(category: string): Promise<Product[]> { ... }
  
  // Creates new product
  newProduct(data: CreateProductDto): Promise<Product> { ... }
}

// ✅ Boolean methods as questions
interface Product {
  isAvailable(): boolean;
  hasDiscount(): boolean;
  canPurchase(): boolean;
}

// ✅ Avoid "get/set" prefixes in method names
class UserProfile {
  // ❌ getName()
  name(): string { ... }
  
  // ❌ setEmail()  
  withEmail(email: string): UserProfile { ... }
}
```

## React Component Standards

### Component Structure
```typescript
// ComponentName.tsx
import { memo } from 'react';
import type { ComponentNameProps } from './types';
import styles from './ComponentName.module.scss';

/**
 * ComponentName renders a [description].
 * 
 * @param props - The component props
 * @returns JSX element
 * 
 * @example
 * ```tsx
 * <ComponentName 
 *   title="Example"
 *   onAction={handleAction}
 * />
 * ```
 */
export const ComponentName = memo<ComponentNameProps>(({
  title,
  children,
  onAction,
  className = '',
  ...restProps
}) => {
  return (
    <div 
      className={`${styles.container} ${className}`}
      {...restProps}
    >
      {/* Implementation */}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';
```

### Custom Hooks
```typescript
// useCustomHook.ts
import { useState, useCallback, useEffect } from 'react';

interface UseCustomHookParams {
  readonly initialValue: string;
  readonly onError?: (error: Error) => void;
}

interface UseCustomHookReturn {
  readonly value: string;
  readonly loading: boolean;
  readonly error: Error | null;
  readonly updateValue: (newValue: string) => void;
  readonly reset: () => void;
}

/**
 * Custom hook for [description].
 * 
 * @param params - Hook parameters
 * @returns Hook state and methods
 */
export const useCustomHook = ({
  initialValue,
  onError
}: UseCustomHookParams): UseCustomHookReturn => {
  const [value, setValue] = useState<string>(initialValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateValue = useCallback((newValue: string): void => {
    setValue(newValue);
  }, []);

  const reset = useCallback((): void => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    loading,
    error,
    updateValue,
    reset
  };
};
```

## SCSS Guidelines

### File Structure
```scss
// ComponentName.module.scss
@import '@/shared/styles/variables';
@import '@/shared/styles/mixins';

.container {
  @include flex-center;
  padding: $spacing-md;
  background-color: var(--background);
  border-radius: var(--radius);
  
  // Nested selectors max 3 levels deep
  .header {
    margin-bottom: $spacing-sm;
    
    .title {
      @include typography-h2;
      color: var(--foreground);
    }
  }
}

// Modifiers use BEM methodology
.container--highlighted {
  border: 2px solid var(--primary);
  box-shadow: 0 2px 8px var(--primary-foreground);
}

// Responsive design mobile-first
@media (min-width: $breakpoint-md) {
  .container {
    padding: $spacing-lg;
  }
}
```

### Design Tokens
```scss
// _variables.scss
// Spacing system (8px grid)
$spacing-xs: 0.25rem;  // 4px
$spacing-sm: 0.5rem;   // 8px
$spacing-md: 1rem;     // 16px
$spacing-lg: 1.5rem;   // 24px
$spacing-xl: 2rem;     // 32px

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// Z-index scale
$z-dropdown: 100;
$z-modal: 200;
$z-toast: 300;
```

## ESLint Configuration

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-readonly-parameter-types": "error",
    "prefer-const": "error",
    "no-var": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

## File Organization

### Naming Conventions
```
// Components: PascalCase
ProductCard.tsx
UserProfile.tsx

// Hooks: camelCase with "use" prefix
useProducts.ts
useAuthentication.ts  

// Utilities: camelCase
formatCurrency.ts
validateEmail.ts

// Types: PascalCase with descriptive suffix
ProductTypes.ts
ApiTypes.ts

// Constants: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts
```

### Export Patterns
```typescript
// Named exports preferred
export const ProductCard = () => { ... };
export const ProductGrid = () => { ... };

// Index files for clean imports
// features/product-catalog/index.ts
export { ProductCard } from './components/ProductCard';
export { ProductGrid } from './components/ProductGrid';  
export { useProducts } from './hooks/useProducts';
export type { Product, ProductCategory } from './types';

// Usage
import { ProductCard, useProducts } from '@/features/product-catalog';
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Validates email address format and domain.
 * 
 * @param email - The email address to validate
 * @param allowedDomains - Optional array of allowed domains
 * @returns True if email is valid, false otherwise
 * 
 * @throws {ValidationError} When email format is invalid
 * 
 * @example
 * ```typescript
 * const isValid = validateEmail('user@example.com');
 * console.log(isValid); // true
 * 
 * const isValidDomain = validateEmail('user@test.com', ['example.com']);
 * console.log(isValidDomain); // false
 * ```
 */
export const validateEmail = (
  email: string, 
  allowedDomains?: readonly string[]
): boolean => {
  // Implementation
};
```

### README Structure
```markdown
# Component/Feature Name

Brief description of purpose and functionality.

## Usage

Basic usage example with code snippet.

## Props/Parameters

Detailed parameter documentation.

## Examples

Multiple usage examples covering different scenarios.

## Testing

How to test the component/feature.

## Notes

Additional implementation details or gotchas.
```