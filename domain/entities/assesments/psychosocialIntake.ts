// domain/entities/assesments/psychosocialIntake.ts
export interface PsychosocialIntakeFormData {
  data_entry_personnel_name: string;
  date_of_assessment: string;
  client_first_name: string;
  client_last_name: string;
  preferred_first_name?: string;
  date_of_birth: string;
  street_address: string;
  address_line_2?: string;
  city?: string;
  state_province_region?: string;
  zip_postal_code?: string;
  country?: string;
  home_phone: string;
  cell_phone: string;
  presenting_concerns?: string;
  collateral_information?: string;
  personal_family_history?: string;
  addictions_substance_use?: string;
  past_mental_health?: string;
  medical_history_status?: string;
  current_medications?: string;
  risk_assessment?: string;
  intervention_plan?: string;
}

export interface PsychosocialIntakeFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: PsychosocialIntakeFormData;
}

export type PsychosocialIntakeForm = PsychosocialIntakeFormPayload;
export type PsychosocialIntakeResponse = { message: string };