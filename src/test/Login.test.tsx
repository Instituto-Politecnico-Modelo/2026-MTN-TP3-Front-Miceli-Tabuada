import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import { renderWithProviders } from './utils';

describe('Login', () => {
  it('renderiza el formulario de login', () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('muestra errores de validación cuando los campos están vacíos', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findByText(/email es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
  });

  it('llama login del contexto con email y password', async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithProviders(<Login />, { auth: { login: mockLogin } });

    await user.type(screen.getByLabelText(/email/i), 'test@mail.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(mockLogin).toHaveBeenCalledWith('test@mail.com', 'password123');
  });

  it('muestra error genérico cuando login falla', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('401'));
    const user = userEvent.setup();
    renderWithProviders(<Login />, { auth: { login: mockLogin } });

    await user.type(screen.getByLabelText(/email/i), 'test@mail.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
  });

  it('tiene link a /registro', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('link', { name: /registrate/i })).toHaveAttribute('href', '/registro');
  });
});
