// application/hooks/useSubmitPsychosocialForm.ts
import { PsychosocialInterventionForm } from "@/domain/entities/assesments/psychosocialIntervention";
import { submitPsychosocialFormUseCase } from '@/domain/use-cases/submitPsychosocialForm';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitPsychosocialForm({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, PsychosocialInterventionForm>({
    mutationFn: (payload: PsychosocialInterventionForm) => submitPsychosocialFormUseCase(payload),
    onSuccess,  
    onError,   
  });
}

