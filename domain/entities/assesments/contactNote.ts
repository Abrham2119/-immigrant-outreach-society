export interface ContactNoteFormData {
  client_full_name: string;
  sql_staff_full_name: string;
  scope_of_service: string[];
  client_name_for_hosting?: string;
  action_information?: string;
  client_request_to_action?: string;
  client_audit_for_hosting?: string;
  party_data_status?: string;
  appointment_status?: string;
  acknowledgement: boolean;
  signature: string;
  name_composition?: string;
  date_completed: string;
}

export interface ContactNoteFormPayload {
  client: string;
  personnel: string;
  service: string;
  formData: ContactNoteFormData;
}

export type ContactNoteForm = ContactNoteFormPayload;
export type ContactNoteResponse = { message: string };