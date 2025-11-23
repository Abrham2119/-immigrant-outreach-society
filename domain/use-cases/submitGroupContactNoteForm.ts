// domain/use-cases/submitGroupContactNoteForm.ts
import { groupContactNoteService } from '@/infrastructure/api/groupContactNoteService';
import { GroupContactNoteForm } from '../entities/assesments/groupContactNote';

export async function submitGroupContactNoteFormUseCase(form: GroupContactNoteForm): Promise<{ message: string }> {
  return groupContactNoteService(form);
}