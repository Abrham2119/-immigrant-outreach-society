// application/hooks/useSubmitGroupContactNoteForm.ts
import { GroupContactNoteForm } from "@/domain/entities/assesments/groupContactNote";
import { submitGroupContactNoteFormUseCase } from "@/domain/use-cases/submitGroupContactNoteForm";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmitGroupContactNoteForm({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: any) => void; 
}) {
  return useMutation<{ message: string }, AxiosError, GroupContactNoteForm>({
    mutationFn: (payload: GroupContactNoteForm) => submitGroupContactNoteFormUseCase(payload),
    onSuccess,  
    onError,   
  });
}