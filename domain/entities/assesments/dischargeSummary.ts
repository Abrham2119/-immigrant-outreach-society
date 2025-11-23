// domain/entities/assesments/dischargeSummary.ts
export interface DischargeSummaryFormData {
  data_entry_personnel_name: string;
  client_first_name: string;
  client_last_name: string;
  ios_staff_first_name: string;
  ios_staff_last_name: string;
  date_of_discharge: string;
  goals_and_concerns: string;
  summary_of_care_provided: string;
  updated_risk_assessment?: string;
  reason_for_discharge?: string;
  recommendations_for_follow_up?: string;
  acknowledgement_name: string;
  acknowledgement_signature?: string;
  date_completed: string;
}

export interface DischargeSummaryFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: DischargeSummaryFormData;
}

export type DischargeSummaryForm = DischargeSummaryFormPayload;
export type DischargeSummaryResponse = { message: string };