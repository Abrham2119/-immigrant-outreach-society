// application/hooks/useSubmitGeneralReferralForm.ts
import { GeneralReferralForm } from "@/domain/entities/assesments/generalReferral";
import { submitGeneralReferralFormUseCase } from "@/domain/use-cases/submitGeneralReferralForm";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitGeneralReferralForm({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, GeneralReferralForm>({
    mutationFn: (payload: GeneralReferralForm) => submitGeneralReferralFormUseCase(payload),
    onSuccess,  
    onError,   
  });
}