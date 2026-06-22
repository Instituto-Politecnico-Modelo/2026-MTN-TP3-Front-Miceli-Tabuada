import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import type { ReactElement } from 'react';

export const mockAuthValue = (overrides: Partial<AuthContextValue> = {}): AuthContextValue => ({
  isAuthenticated: false,
  usuario: null,
  token: null,
  rol: null,
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn().mockReturnValue(false),
  ...overrides,
});

interface WrapperOptions extends RenderOptions {
  initialEntries?: string[];
  auth?: Partial<AuthContextValue>;
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], auth = {}, ...options }: WrapperOptions = {},
) {
  const contextValue = mockAuthValue(auth);
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </AuthContext.Provider>,
    options,
  );
}
