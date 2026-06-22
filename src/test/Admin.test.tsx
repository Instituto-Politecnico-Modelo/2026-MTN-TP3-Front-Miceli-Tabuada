import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import AdminDashboard from '../pages/admin/Dashboard';
import CanchasABM from '../pages/admin/CanchasABM';
import { renderWithProviders } from './utils';

vi.mock('../services/canchas', () => ({
  canchasService: {
    getAllCanchas: vi.fn().mockResolvedValue({ data: [] }),
    createCancha: vi.fn(),
    updateCancha: vi.fn(),
    deleteCancha: vi.fn(),
    updateEstadoCancha: vi.fn(),
  },
}));

vi.mock('../services/turnos', () => ({
  turnosService: {
    getTurnosByCancha: vi.fn().mockResolvedValue({ data: [] }),
    createTurno: vi.fn(),
    updateTurno: vi.fn(),
    deleteTurno: vi.fn(),
    updateDisponibilidad: vi.fn(),
  },
}));

describe('AdminDashboard', () => {
  it('renderiza el panel de administración', () => {
    renderWithProviders(<AdminDashboard />, { auth: { isAuthenticated: true, rol: 'ADMINISTRADOR' } });
    expect(screen.getByRole('heading', { name: /panel de administración/i })).toBeInTheDocument();
  });

  it('tiene cards de acceso rápido', () => {
    renderWithProviders(<AdminDashboard />, { auth: { isAuthenticated: true, rol: 'ADMINISTRADOR' } });
    expect(screen.getByRole('link', { name: /canchas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /turnos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /usuarios/i })).toBeInTheDocument();
  });
});

describe('CanchasABM', () => {
  it('renderiza el título y el botón de crear', async () => {
    renderWithProviders(<CanchasABM />, { auth: { isAuthenticated: true, rol: 'ADMINISTRADOR' } });
    expect(await screen.findByText(/gestión de canchas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nueva cancha/i })).toBeInTheDocument();
  });

  it('muestra la tabla vacía cuando no hay canchas', async () => {
    renderWithProviders(<CanchasABM />, { auth: { isAuthenticated: true, rol: 'ADMINISTRADOR' } });
    await screen.findByText(/gestión de canchas/i);
    // tabla presente pero sin filas de datos
    const rows = screen.queryAllByRole('row');
    expect(rows.length).toBe(1); // solo el header
  });
});
