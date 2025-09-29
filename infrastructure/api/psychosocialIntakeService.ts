// infrastructure/api/psychosocialIntakeService.ts
import api from './axios';
import { PsychosocialIntakeForm, PsychosocialIntakeResponse } from '@/domain/entities/assesments/psychosocialIntake';

export async function psychosocialIntakeService(form: PsychosocialIntakeForm): Promise<PsychosocialIntakeResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}