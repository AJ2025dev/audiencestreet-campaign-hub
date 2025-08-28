import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BudgetControl from './BudgetControl';

// Mock the hooks and components that are used in BudgetControl
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
}));

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

// Mock useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const queryClient = new QueryClient();

describe('BudgetControl', () => {
  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetControl />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Budget Control Center')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetControl />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Loading budget data...')).toBeInTheDocument();
  });
});