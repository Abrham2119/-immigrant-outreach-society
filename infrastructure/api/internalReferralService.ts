// infrastructure/api/internalReferralService.ts
import api from './axios';
import { InternalReferralForm, InternalReferralResponse } from '@/domain/entities/assesments/internalReferral';

export async function internalReferralService(form: InternalReferralForm): Promise<InternalReferralResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}