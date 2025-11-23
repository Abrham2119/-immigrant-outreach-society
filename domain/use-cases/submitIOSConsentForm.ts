import { iosConsentService } from '@/infrastructure/api/iosConsentService';
import { IOSConsentForm } from '../entities/assesments/iosConsent';

export const submitIOSConsentFormUseCase = async (form: IOSConsentForm): Promise<{ message: string }> => {
  const response = await iosConsentService(form);
  return { message: response.message };
};