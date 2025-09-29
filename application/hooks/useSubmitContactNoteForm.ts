// application/hooks/useSubmitContactNoteForm.ts
import { ContactNoteForm } from "@/domain/entities/assesments/contactNote";
import { submitContactNoteFormUseCase } from "@/domain/use-cases/submitContactNoteForm";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitContactNoteForm({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, ContactNoteForm>({
    mutationFn: (payload: ContactNoteForm) => submitContactNoteFormUseCase(payload),
    onSuccess,  
    onError,   
  });
}