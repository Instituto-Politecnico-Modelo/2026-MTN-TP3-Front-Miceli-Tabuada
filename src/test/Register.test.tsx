import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../pages/Register';
import { renderWithProviders } from './utils';

vi.mock('../services/auth', () => ({
  authService: {
    registro: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authService } from '../services/auth';

describe('Register', () => {
  it('renderiza todos los campos del formulario', () => {
    renderWithProviders(<Register />);
    expect(screen.getByLabelText(/^dni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar/i)).toBeInTheDocument();
  });

  it('valida DNI con formato incorrecto', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByLabelText(/^dni/i), 'abc');
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/7 u 8 dígitos/i)).toBeInTheDocument();
  });

  it('valida que las contraseñas coincidan', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByLabelText(/^contraseña/i), 'pass1234');
    await user.type(screen.getByLabelText(/confirmar/i), 'distinta');
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it('llama a authService.registro con los datos correctos', async () => {
    vi.mocked(authService.registro).mockResolvedValue({} as never);
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByLabelText(/^dni/i), '12345678');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan');
    await user.type(screen.getByLabelText(/apellido/i), 'Pérez');
    await user.type(screen.getByLabelText(/email/i), 'juan@mail.com');
    await user.type(screen.getByLabelText(/^contraseña/i), 'Password1!');
    await user.type(screen.getByLabelText(/confirmar/i), 'Password1!');
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(authService.registro).toHaveBeenCalledWith(
      expect.objectContaining({ dni: '12345678', email: 'juan@mail.com' }),
    );
  });
});
