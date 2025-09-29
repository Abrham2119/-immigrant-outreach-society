// domain/use-cases/submitContactNoteForm.ts
import { contactNoteService } from '@/infrastructure/api/contactNoteService';
import { ContactNoteForm } from '../entities/assesments/contactNote';

export async function submitContactNoteFormUseCase(form: ContactNoteForm): Promise<{ message: string }> {
  return contactNoteService(form);
}