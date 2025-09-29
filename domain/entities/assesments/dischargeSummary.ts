export interface DischargeSummaryFormData {
  future_consideration: string;
  detail_check: string;
  features: string[];
  key_features: string[];
  other_attributes: string[];
  additional_information?: string;
  documentation_status?: string;
  acknowledgement_status: string;
  output_status: string;
  doctor_signature: string;
  patient_consent: string;
  discharge_date: string;
  final_acknowledgement: boolean;
}

export interface DischargeSummaryFormPayload {
  patient: string;
  doctor: string;
  department: string;
  formData: DischargeSummaryFormData;
}

export type DischargeSummaryForm = DischargeSummaryFormPayload;
export type DischargeSummaryResponse = { message: string };