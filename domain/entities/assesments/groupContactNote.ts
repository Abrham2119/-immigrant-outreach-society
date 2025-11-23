// domain/entities/assesments/groupContactNote.ts
export interface GroupContactNoteFormData {
  data_entry_personnel_name: string;
  group_name: string;
  ios_staff_1_first_name?: string;
  ios_staff_1_last_name?: string;
  ios_staff_2_first_name?: string;
  ios_staff_2_last_name?: string;
  ios_staff_3_first_name?: string;
  ios_staff_3_last_name?: string;
  duration_minutes: number;
  method_of_contact: string[];
  other_method_explanation?: string;
  participants?: string;
  acknowledgement_first_name?: string;
  acknowledgement_last_name?: string;
  signature?: string;
  date_completed: string;
}

export interface GroupContactNoteFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: GroupContactNoteFormData;
}

export type GroupContactNoteForm = GroupContactNoteFormPayload;
export type GroupContactNoteResponse = { message: string };