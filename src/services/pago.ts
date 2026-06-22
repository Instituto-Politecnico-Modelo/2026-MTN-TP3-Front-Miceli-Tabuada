import api from './api';
import type { PagoIniciarResponse } from '../types';

export const pagoService = {
  iniciarPago: (reservaId: number) =>
    api.post<PagoIniciarResponse>(`/pagos/iniciar/${reservaId}`, {}),
};
