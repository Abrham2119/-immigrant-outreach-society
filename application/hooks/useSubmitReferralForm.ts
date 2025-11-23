// // application/hooks/useSubmitReferralForm.ts
// import { ReferralForm } from "@/domain/entities/assesments/referralForm";
// import { submitReferralFormUseCase } from '@/domain/use-cases/submitReferralForm';
// import { useMutation } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// export function useSubmitReferralForm({ onSuccess, onError }: { 
//   onSuccess: () => void; 
//   onError: (error: any) => void; 
// }) {
//   return useMutation<{ message: string }, AxiosError, ReferralForm>({
//     mutationFn: (payload: ReferralForm) => submitReferralFormUseCase(payload),
//     onSuccess,  
//     onError,   
//   });
// }