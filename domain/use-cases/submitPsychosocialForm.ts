import { psychosocialService } from '@/infrastructure/api/psychosocialService';
import { PsychosocialInterventionForm } from '../entities/assesments/psychosocialIntervention';

export const submitPsychosocialFormUseCase = async (form: PsychosocialInterventionForm): Promise<{ message: string }> => {
  return psychosocialService(form);
};