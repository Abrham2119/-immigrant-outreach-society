import api from './axios';
import { IOSConsentForm, IOSConsentResponse } from '@/domain/entities/assesments/iosConsent';

export const iosConsentService = async (form: IOSConsentForm): Promise<IOSConsentResponse> => {
  const { data } = await api.post<IOSConsentResponse>('/consent/save', form);
  return data;
};