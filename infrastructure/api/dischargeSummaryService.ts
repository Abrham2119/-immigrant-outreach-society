// infrastructure/api/dischargeSummaryService.ts
import { DischargeSummaryForm, DischargeSummaryResponse } from '@/domain/entities/assesments/dischargeSummary';
import api from './axios';

export async function dischargeSummaryService(form: DischargeSummaryForm): Promise<DischargeSummaryResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}