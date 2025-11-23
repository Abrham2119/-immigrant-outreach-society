import { getConsentByClientId } from '@/infrastructure/api/consentService';
import { ConsentFormResponse } from '@/infrastructure/api/consentService';

export const getConsentByClientIdUseCase = async (clientId: string): Promise<ConsentFormResponse> => {
  return getConsentByClientId(clientId);
};