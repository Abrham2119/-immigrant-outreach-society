// domain/use-cases/submitPsychosocialForm.ts
import { psychosocialService } from '@/infrastructure/api/psychosocialService';
import { PsychosocialInterventionForm } from '../entities/assesments/psychosocialIntervention';

export async function submitPsychosocialFormUseCase(form: PsychosocialInterventionForm): Promise<{ message: string }> {
  return psychosocialService(form);
}