// domain/use-cases/submitInternalReferralForm.ts
import { internalReferralService } from '@/infrastructure/api/internalReferralService';
import { InternalReferralForm } from '../entities/assesments/internalReferral';

export async function submitInternalReferralFormUseCase(form: InternalReferralForm): Promise<{ message: string }> {
  return internalReferralService(form);
}