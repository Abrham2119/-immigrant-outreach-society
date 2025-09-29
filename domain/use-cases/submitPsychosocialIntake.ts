// domain/use-cases/submitPsychosocialIntake.ts
import { psychosocialIntakeService } from '@/infrastructure/api/psychosocialIntakeService';
import { PsychosocialIntakeForm } from '../entities/assesments/psychosocialIntake';

export async function submitPsychosocialIntakeUseCase(form: PsychosocialIntakeForm): Promise<{ message: string }> {
  return psychosocialIntakeService(form);
}