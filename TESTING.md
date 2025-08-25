# Testing Setup for AudienceStreet Campaign Hub

## Overview

This project includes a comprehensive testing setup with multiple tools to ensure quality and reliability:

1. **Jest** - Unit testing framework
2. **Playwright** - End-to-end testing
3. **Storybook** - Component development and testing
4. **Testing Library** - React component testing utilities

## Getting Started

### Installation

```bash
npm install
```

### Running Tests

1. **Unit Tests**:
   ```bash
   npm run test
   ```

2. **Watch Mode**:
   ```bash
   npm run test:watch
   ```

3. **Coverage Report**:
   ```bash
   npm run test:coverage
   ```

4. **End-to-End Tests**:
   ```bash
   npm run test:e2e
   ```

5. **Storybook**:
   ```bash
   npm run storybook
   ```

## Test Structure

- Unit tests: `src/**/*.test.tsx`
- Integration tests: `src/**/*.spec.tsx`
- E2E tests: `e2e/**/*.spec.ts`
- Stories: `src/**/*.stories.tsx`

## Writing Tests

### Unit Tests

Unit tests should focus on individual components and functions. Use Jest and Testing Library for React components.

Example:
```typescript
import { render, screen } from '@testing-library/react';
import BudgetControl from './BudgetControl';

test('renders budget control header', () => {
  render(<BudgetControl />);
  expect(screen.getByText('Budget Control Center')).toBeInTheDocument();
});
```

### Component Tests

Component tests should verify the behavior of individual components in isolation.

### E2E Tests

E2E tests should cover critical user flows and interactions.

### Storybook

Use Storybook to develop and test components in isolation.

## CI/CD Integration

Tests are automatically run in the GitHub Actions workflows:

1. `auto-deploy-and-qa.yml` - Runs smoke tests after deployment
2. `staging-deploy.yml` - Runs comprehensive tests in staging environment

## Best Practices

1. Write tests for critical user flows
2. Maintain good test coverage for core functionality
3. Use mocking for external dependencies
4. Keep tests focused and isolated
5. Use descriptive test names
6. Run tests regularly during development