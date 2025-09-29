// application/hooks/useSubmitDischargeSummaryForm.ts
import { DischargeSummaryForm } from '@/domain/entities/assesments/dischargeSummary';
import { submitDischargeSummaryFormUseCase } from '@/domain/use-cases/submitDischargeSummaryForm';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitDischargeSummaryForm({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, DischargeSummaryForm>({
    mutationFn: (payload: DischargeSummaryForm) => submitDischargeSummaryFormUseCase(payload),
    onSuccess,  
    onError,   
  });
}