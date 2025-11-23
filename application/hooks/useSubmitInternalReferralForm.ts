// application/hooks/useSubmitInternalReferralForm.ts
import { InternalReferralForm } from "@/domain/entities/assesments/internalReferral";
import { submitInternalReferralFormUseCase } from "@/domain/use-cases/submitInternalReferralForm";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitInternalReferralForm({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, InternalReferralForm>({
    mutationFn: (payload: InternalReferralForm) => submitInternalReferralFormUseCase(payload),
    onSuccess,  
    onError,   
  });
}