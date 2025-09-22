# Testing Strategy

This document outlines our comprehensive testing approach for the Walgreens POC application, emphasizing clean code practices, thorough coverage, and maintainable test suites.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Levels](#testing-levels)
- [Testing Tools](#testing-tools)
- [Test Structure](#test-structure)
- [Coverage Requirements](#coverage-requirements)
- [Testing Patterns](#testing-patterns)
- [Mock Strategy](#mock-strategy)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **User-Centric Testing**: Write tests that reflect real user interactions
3. **Maintainable Tests**: Tests should be easy to read, understand, and maintain
4. **Fast Feedback**: Tests should run quickly to enable rapid development cycles
5. **Confidence in Refactoring**: Comprehensive tests enable safe code changes

### Testing Pyramid

```
    ┌─────────────────┐
    │   E2E Tests     │  <- Few, high-level user flows
    │     (5%)        │
    ├─────────────────┤
    │ Integration     │  <- Component interactions
    │   Tests (15%)   │
    ├─────────────────┤
    │   Unit Tests    │  <- Individual functions/components
    │     (80%)       │
    └─────────────────┘
```

## Testing Levels

### Unit Tests (80% of tests)

Test individual components, functions, and hooks in isolation.

**What to test:**
- Component rendering with different props
- Event handlers and user interactions
- State changes and side effects
- Utility functions and business logic
- Custom hooks behavior

**Example structure:**
```typescript
// src/components/Button/Button.test.tsx
describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with correct text')
    it('applies variant styles correctly')
    it('handles disabled state')
  })

  describe('Interactions', () => {
    it('calls onClick when clicked')
    it('prevents click when disabled')
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes')
    it('supports keyboard navigation')
  })
})
```

### Integration Tests (15% of tests)

Test component interactions and feature workflows.

**What to test:**
- Form submission flows
- Multi-component interactions
- API integration with mocked services
- State management across components
- Route navigation

**Example:**
```typescript
// src/features/auth/LoginFlow.test.tsx
describe('Login Flow Integration', () => {
  it('completes full login process')
  it('handles validation errors')
  it('redirects after successful login')
})
```

### End-to-End Tests (5% of tests)

Test complete user journeys with real browser interactions.

**What to test:**
- Critical user paths (login, purchase flow)
- Cross-browser compatibility
- Performance benchmarks
- Accessibility compliance

## Testing Tools

### Core Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **User Events**: Realistic user interaction simulation

### Additional Tools

- **Jest-DOM**: Custom Jest matchers for DOM testing
- **Playwright**: End-to-end testing (future implementation)
- **Axe-Core**: Accessibility testing
- **React Hook Testing Library**: Custom hooks testing

## Test Structure

### File Organization

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── Button.stories.tsx
├── pages/
│   └── LoginPage/
│       ├── LoginPage.tsx
│       ├── LoginPage.test.tsx
│       └── components/
│           └── LoginForm/
│               ├── LoginForm.tsx
│               └── LoginForm.test.tsx
└── __tests__/
    ├── setup.ts
    ├── utils/
    │   ├── test-utils.tsx
    │   └── mocks/
    └── integration/
        └── auth-flow.test.tsx
```

### Test File Naming

- Unit tests: `Component.test.tsx`
- Integration tests: `feature-name-integration.test.tsx`
- E2E tests: `user-journey.e2e.test.tsx`

### Test Setup Configuration

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { server } from './utils/mocks/server';

// Mock API server setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

## Coverage Requirements

### Minimum Coverage Targets

- **Overall Coverage**: 90%
- **Component Coverage**: 95%
- **Utility Functions**: 100%
- **Custom Hooks**: 95%
- **Critical Paths**: 100%

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/shared/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
```

## Testing Patterns

### Component Testing Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<Button {...defaultProps} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Custom Hook Testing Pattern

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });
});
```

### Form Testing Pattern

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('displays validation errors for invalid input', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
```

## Mock Strategy

### API Mocking with MSW

```typescript
// src/__tests__/utils/mocks/handlers.ts
import { rest } from 'msw';
import { mockProducts, mockUsers } from './data';

export const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mockProducts,
        success: true,
        message: 'Products retrieved',
      })
    );
  }),

  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          user: mockUsers[0],
          token: 'mock-token',
        },
        success: true,
      })
    );
  }),
];
```

### Component Mocking

```typescript
// Mock complex child components
jest.mock('../ComplexChart', () => ({
  ComplexChart: () => <div data-testid="mocked-chart">Chart</div>,
}));

// Mock third-party libraries
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
```

### Custom Test Utilities

```typescript
// src/__tests__/utils/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../app/providers/AuthProvider';
import { theme } from '../../app/theme/muiTheme';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Accessibility Testing

### Automated A11y Tests

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProductCard } from './ProductCard';

expect.extend(toHaveNoViolations);

describe('ProductCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={jest.fn()} 
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Test keyboard focus
    addButton.focus();
    expect(addButton).toHaveFocus();
    
    // Test Enter key activation
    fireEvent.keyDown(addButton, { key: 'Enter' });
    expect(mockOnAddToCart).toHaveBeenCalled();
  });
});
```

## Performance Testing

### Component Performance Tests

```typescript
import { render } from '@testing-library/react';
import { ProductList } from './ProductList';

describe('ProductList Performance', () => {
  it('renders large product list efficiently', () => {
    const largeProductList = Array.from({ length: 1000 }, (_, i) => ({
      id: `product-${i}`,
      name: `Product ${i}`,
      price: 10 + i,
    }));

    const startTime = performance.now();
    render(<ProductList products={largeProductList} />);
    const endTime = performance.now();

    // Should render within reasonable time (adjust threshold as needed)
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## Test Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false",
    "test:debug": "jest --debug",
    "test:update-snapshots": "jest --updateSnapshot"
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Testing Checklist

### Before Writing Tests

- [ ] Understand the component's purpose and behavior
- [ ] Identify edge cases and error scenarios
- [ ] Consider accessibility requirements
- [ ] Plan mock strategy for dependencies

### Writing Tests

- [ ] Use descriptive test names
- [ ] Test behavior, not implementation
- [ ] Include positive and negative test cases
- [ ] Test accessibility features
- [ ] Mock external dependencies appropriately

### After Writing Tests

- [ ] Verify test coverage meets requirements
- [ ] Run tests in CI environment
- [ ] Review test maintainability
- [ ] Document complex test scenarios

## Best Practices

### Do's

- Write tests that would fail if the feature is broken
- Use semantic queries (getByRole, getByLabelText)
- Test user interactions realistically
- Keep tests focused and isolated
- Use meaningful assertions
- Test error states and edge cases

### Don'ts

- Don't test implementation details
- Don't rely on component internal state
- Don't over-mock (mock only what's necessary)
- Don't write tests that pass without the feature
- Don't ignore accessibility in tests
- Don't let tests become unmaintainable

## Future Enhancements

### Planned Improvements

1. **Visual Regression Testing**: Integration with Chromatic for UI consistency
2. **End-to-End Testing**: Playwright implementation for critical user journeys
3. **Performance Budgets**: Automated performance regression detection
4. **Contract Testing**: API contract validation between frontend and backend
5. **Mutation Testing**: Verify test suite effectiveness with mutation testing tools

This testing strategy ensures high-quality, maintainable code while providing confidence in our application's reliability and user experience.