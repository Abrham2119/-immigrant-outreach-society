// application/hooks/useSubmitPsychosocialIntake.ts
import { PsychosocialIntakeForm } from "@/domain/entities/assesments/psychosocialIntake";
import { submitPsychosocialIntakeUseCase } from '@/domain/use-cases/submitPsychosocialIntake';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitPsychosocialIntake({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, PsychosocialIntakeForm>({
    mutationFn: (payload: PsychosocialIntakeForm) => submitPsychosocialIntakeUseCase(payload),
    onSuccess,  
    onError,   
  });
}