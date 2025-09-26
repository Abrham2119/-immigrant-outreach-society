import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUserUseCase } from '@/domain/use-cases/registerUser';
import { RegistrationFormClients } from '@/domain/entities/registration';
import { AxiosError } from "axios";

export function useRegisterUser({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, RegistrationFormClients>({
    mutationFn: (payload: RegistrationFormClients) => registerUserUseCase(payload),
    onSuccess,  
    onError,   
  });
}