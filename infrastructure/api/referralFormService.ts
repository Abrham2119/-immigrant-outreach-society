import api from './axios';
import { ReferralForm, ReferralFormResponse } from '@/domain/entities/assesments/referralForm';

export async function referralFormService(form: ReferralForm): Promise<ReferralFormResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}