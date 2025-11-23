// domain/use-cases/submitGeneralReferralForm.ts
import { generalReferralService } from '@/infrastructure/api/generalReferralService';
import { GeneralReferralForm } from '../entities/assesments/generalReferral';

export async function submitGeneralReferralFormUseCase(form: GeneralReferralForm): Promise<{ message: string }> {
  return generalReferralService(form);
}