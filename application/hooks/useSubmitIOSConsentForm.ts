import { IOSConsentForm } from "@/domain/entities/assesments/iosConsent";
import { submitIOSConsentFormUseCase } from '@/domain/use-cases/submitIOSConsentForm';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UseSubmitIOSConsentFormProps {
  onSuccess: () => void;
  onError: (error: AxiosError<{ message: string }>) => void;
}

export const useSubmitIOSConsentForm = ({ onSuccess, onError }: UseSubmitIOSConsentFormProps) => {
  return useMutation<{ message: string }, AxiosError<{ message: string }>, IOSConsentForm>({
    mutationFn: submitIOSConsentFormUseCase,
    onSuccess,
    onError,
  });
};