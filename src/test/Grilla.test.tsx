import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Grilla from '../pages/Grilla';
import { renderWithProviders } from './utils';
import type { DisponibilidadItem } from '../types';

vi.mock('../services/reservas', () => ({
  reservasService: {
    getDisponibilidad: vi.fn(),
    getMisReservas: vi.fn(),
    createReserva: vi.fn(),
    cancelarReserva: vi.fn(),
    getClimaParaTurno: vi.fn(),
    getAllReservas: vi.fn(),
    cancelarReservaAdmin: vi.fn(),
  },
}));

import { reservasService } from '../services/reservas';

const itemLibre: DisponibilidadItem = {
  turnoId: 1,
  canchaId: 1,
  canchaNombre: 'Cancha Norte',
  diaSemana: 'LUNES',
  horaInicio: '18:00:00',
  horaFin: '19:00:00',
  reservado: false,
  reservaId: null,
};

const itemOcupado: DisponibilidadItem = {
  ...itemLibre,
  turnoId: 2,
  canchaNombre: 'Cancha Sur',
  reservado: true,
  reservaId: 99,
};

describe('Grilla', () => {
  beforeEach(() => {
    vi.mocked(reservasService.getDisponibilidad).mockResolvedValue({ data: [itemLibre, itemOcupado] } as never);
  });

  it('renderiza el selector de fecha y el botón actualizar', async () => {
    renderWithProviders(<Grilla />);
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    // Esperar que el fetch termine para que el botón deje de decir "Cargando..."
    expect(await screen.findByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  it('muestra los turnos disponibles con botón Reservar', async () => {
    renderWithProviders(<Grilla />, { auth: { isAuthenticated: true, rol: 'CLIENTE' } });
    expect(await screen.findByText('Cancha Norte')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reservar/i })).toBeInTheDocument();
  });

  it('solo muestra botón Reservar para turnos disponibles', async () => {
    renderWithProviders(<Grilla />);
    // Esperar que carguen los items (itemLibre + itemOcupado)
    await screen.findByText('Cancha Norte');
    // Solo el item libre (Cancha Norte) debe tener botón Reservar
    expect(screen.getAllByRole('button', { name: /reservar/i })).toHaveLength(1);
    // El item ocupado (Cancha Sur) no debe tener botón Reservar
    expect(screen.getByText('Cancha Sur')).toBeInTheDocument();
  });

  it('muestra mensaje de error si la API falla', async () => {
    vi.mocked(reservasService.getDisponibilidad).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<Grilla />);
    expect(await screen.findByText(/no se pudo cargar/i)).toBeInTheDocument();
  });
});
