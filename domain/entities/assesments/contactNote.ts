// domain/entities/assesments/contactNote.ts
export interface ContactNoteFormData {
  data_entry_personnel_name: string;
  client_first_name: string;
  client_last_name: string;
  ios_staff_first_name: string;
  ios_staff_last_name: string;
  date_of_contact: string;
  client_concerns?: string;
  interventions?: string;
  client_response?: string;
  future_actions?: string;
  date_of_next_appointment: string;
  acknowledgement_name: string;
  acknowledgement_signature: string;
  date_completed: string;
}

export interface ContactNoteFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: ContactNoteFormData;
}

export type ContactNoteForm = ContactNoteFormPayload;
export type ContactNoteResponse = { message: string };