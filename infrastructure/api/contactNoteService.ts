// infrastructure/api/contactNoteService.ts
import api from './axios';
import { ContactNoteForm, ContactNoteResponse } from '@/domain/entities/assesments/contactNote';

export async function contactNoteService(form: ContactNoteForm): Promise<ContactNoteResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}