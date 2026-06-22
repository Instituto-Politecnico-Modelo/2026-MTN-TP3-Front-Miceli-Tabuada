import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import ClienteDashboard from '../pages/cliente/Dashboard';
import { renderWithProviders } from './utils';
import type { ReservaResponse } from '../types';

vi.mock('../services/reservas', () => ({
  reservasService: {
    getMisReservas: vi.fn(),
    cancelarReserva: vi.fn(),
    getDisponibilidad: vi.fn(),
    createReserva: vi.fn(),
    getClimaParaTurno: vi.fn(),
    getAllReservas: vi.fn(),
    cancelarReservaAdmin: vi.fn(),
  },
}));

import { reservasService } from '../services/reservas';

const reservaMock: ReservaResponse = {
  id: 1,
  fecha: '2026-07-01',
  estado: 'CONFIRMADA',
  motivoCancelacion: null,
  turnoId: 1,
  diaSemana: 'LUNES',
  horaInicio: '18:00:00',
  horaFin: '19:00:00',
  canchaId: 1,
  canchaNombre: 'Cancha Norte',
  usuarioId: 42,
};

describe('ClienteDashboard', () => {
  beforeEach(() => {
    vi.mocked(reservasService.getMisReservas).mockResolvedValue({ data: [reservaMock] } as never);
  });

  it('renderiza el título de la página', async () => {
    renderWithProviders(<ClienteDashboard />, { auth: { isAuthenticated: true, rol: 'CLIENTE' } });
    expect(await screen.findByText(/mis reservas/i)).toBeInTheDocument();
  });

  it('muestra las reservas del usuario', async () => {
    renderWithProviders(<ClienteDashboard />, { auth: { isAuthenticated: true, rol: 'CLIENTE' } });
    expect(await screen.findByText('Cancha Norte')).toBeInTheDocument();
    expect(screen.getByText('2026-07-01')).toBeInTheDocument();
    expect(screen.getByText('CONFIRMADA')).toBeInTheDocument();
  });

  it('muestra estado vacío si no hay reservas', async () => {
    vi.mocked(reservasService.getMisReservas).mockResolvedValue({ data: [] } as never);
    renderWithProviders(<ClienteDashboard />, { auth: { isAuthenticated: true, rol: 'CLIENTE' } });
    expect(await screen.findByText(/no tenés reservas/i)).toBeInTheDocument();
  });

  it('tiene link a nueva reserva', async () => {
    renderWithProviders(<ClienteDashboard />, { auth: { isAuthenticated: true, rol: 'CLIENTE' } });
    await screen.findByText(/mis reservas/i);
    expect(screen.getByRole('link', { name: /nueva reserva/i })).toBeInTheDocument();
  });
});
