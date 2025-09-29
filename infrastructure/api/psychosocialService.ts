// infrastructure/api/psychosocialService.ts
import api from './axios';
import { PsychosocialInterventionForm, PsychosocialInterventionResponse } from '@/domain/entities/assesments/psychosocialIntervention';

export async function psychosocialService(form: PsychosocialInterventionForm): Promise<PsychosocialInterventionResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}