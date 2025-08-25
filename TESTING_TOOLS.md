# Recommended Testing Tools for AudienceStreet Campaign Hub

## 1. Playwright (End-to-End Testing)

Playwright is the most comprehensive end-to-end testing framework for modern web applications. It provides cross-browser support and is particularly well-suited for testing React applications.

### Benefits:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Built-in test runner and assertions
- Excellent for testing user flows and interactions
- Supports parallel test execution
- Has a rich ecosystem of tools and integrations

### Setup:
```bash
npm init playwright@latest
```

### Example Test:
```typescript
import { test, expect } from '@playwright/test';

test('should create a campaign with AI strategy', async ({ page }) => {
  await page.goto('/campaigns');
  await page.click('button:has-text("Auto")');
  await expect(page.locator('.toast-success')).toBeVisible();
});
```

## 2. Jest (Unit Testing)

Jest is a JavaScript testing framework that works well with React components and is widely adopted in the React ecosystem.

### Benefits:
- Zero configuration setup
- Built-in mocking and assertion libraries
- Snapshot testing capabilities
- Great for testing individual components and functions

### Setup:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Example Test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Campaigns from '@/pages/Campaigns';

test('renders campaign list', () => {
  render(<Campaigns />);
  expect(screen.getByText('Campaigns')).toBeInTheDocument();
});
```

## 3. Cypress (Component Testing)

Cypress provides excellent component testing capabilities with its intuitive API and real browser testing.

### Benefits:
- Component-level testing with real browser interactions
- Visual testing and debugging capabilities
- Time-travel debugging
- Network stubbing and mocking

### Setup:
```bash
npm install --save-dev cypress
```

### Example Test:
```javascript
describe('BudgetControl Component', () => {
  it('opens budget editing dialog when settings button is clicked', () => {
    cy.mount(<BudgetControl />);
    cy.get('[data-testid="settings-button"]').click();
    cy.get('[data-testid="budget-dialog"]').should('be.visible');
  });
});
```

## 4. Storybook (UI Component Development)

Storybook is an essential tool for UI component development and testing in isolation.

### Benefits:
- UI component explorer
- Isolated component development
- Integration with testing tools
- Visual regression testing capabilities

### Setup:
```bash
npx storybook init
```

### Example Story:
```typescript
import { Meta, StoryObj } from '@storybook/react';
import { BudgetControl } from '@/pages/BudgetControl';

const meta: Meta<typeof BudgetControl> = {
  component: BudgetControl,
  title: 'Pages/BudgetControl',
};

export default meta;
type Story = StoryObj<typeof BudgetControl>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```

## Integration Recommendations

1. **Development Workflow**:
   - Use Storybook for component development
   - Write unit tests with Jest during development
   - Use Cypress for component testing

2. **CI/CD Integration**:
   - Add Playwright tests to GitHub Actions workflows
   - Run Jest unit tests in CI pipeline
   - Include visual regression tests with Storybook

3. **Staging Environment Testing**:
   - Automated E2E tests with Playwright
   - Smoke tests for critical API endpoints
   - Manual QA verification using Storybook components