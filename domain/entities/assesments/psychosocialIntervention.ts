// domain/entities/assesments/psychosocialIntervention.ts
export interface PsychosocialInterventionFormData {
  data_entry_personnel_name: string;
  client_first_name: string;
  client_last_name: string;
  ios_staff_first_name: string;
  ios_staff_last_name: string;
  date: string;
  goals: string;
  modalities?: string[];
  other_agencies_programs?: string;
  acknowledgement_name: string;
  signature: string;
  date_completed: string;
}

export interface PsychosocialInterventionFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: PsychosocialInterventionFormData;
}

export type PsychosocialInterventionForm = PsychosocialInterventionFormPayload;
export type PsychosocialInterventionResponse = { message: string };