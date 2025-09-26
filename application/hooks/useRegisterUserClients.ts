import { RegistrationFormClientsReceptForm } from "@/domain/entities/registrationClient";
import { registerUserUseCase } from '@/domain/use-cases/registerUserClients';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useRegisterUserClients({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, RegistrationFormClientsReceptForm>({
    mutationFn: (payload: RegistrationFormClientsReceptForm) => registerUserUseCase(payload),
    onSuccess,  
    onError,   
  });
}