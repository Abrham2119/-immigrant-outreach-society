// infrastructure/api/groupContactNoteService.ts
import api from './axios';
import { GroupContactNoteForm, GroupContactNoteResponse } from '@/domain/entities/assesments/groupContactNote';

export async function groupContactNoteService(form: GroupContactNoteForm): Promise<GroupContactNoteResponse> {
  const { data } = await api.post('/forms/add', form);
  return data;
}