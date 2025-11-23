// infrastructure/api/generalReferralService.ts
import api from './axios';
import { GeneralReferralForm, GeneralReferralResponse } from '@/domain/entities/assesments/generalReferral';

export async function generalReferralService(form: GeneralReferralForm): Promise<GeneralReferralResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}