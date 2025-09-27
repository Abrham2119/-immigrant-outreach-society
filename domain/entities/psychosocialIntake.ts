// domain/entities/psychosocialIntake.ts
export interface PsychosocialIntakeForm {
  client: string;
  personnel: string;
  service: string;
  formData: {
    client_name?: string;
    date_of_assessment?: string;
    date_of_birth?: string;
    gender?: string;
    marital_status?: string;
    nationality?: string;
    immigration_status?: string;
    language?: string;
    address?: string;
    phone_number?: string;
    email?: string;
    emergency_contact?: string;
    presenting_problem?: string;
    medical_history?: string;
    mental_health_history?: string;
    substance_use_history?: string;
    family_history?: string;
    social_support?: string;
    current_medications?: string;
    strengths_resources?: string;
    risk_assessment?: string;
    referred_by?: string;
    services_requested?: string[];
    consent_to_treatment?: boolean;
    confidentiality_acknowledgment?: boolean;
    assessor_name?: string;
    assessor_signature?: string;
  };
}

export interface PsychosocialIntakeResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    client: string;
    personnel: string;
    service: string;
    formData: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  };
}


export interface PsychosocialIntakeFormPayload {
  client: string;
  personnel: string;
  service: string;
  formData: {
    client_name?: string;
    date_of_assessment?: string;
    date_of_birth?: string;
    gender?: string;
    marital_status?: string;
    nationality?: string;
    immigration_status?: string;
    language?: string;
    address?: string;
    phone_number?: string;
    email?: string;
    emergency_contact?: string;
    presenting_problem?: string;
    medical_history?: string;
    mental_health_history?: string;
    substance_use_history?: string;
    family_history?: string;
    social_support?: string;
    current_medications?: string;
    strengths_resources?: string;
    risk_assessment?: string;
    referred_by?: string;
    services_requested?: string[];
    consent_to_treatment?: boolean;
    confidentiality_acknowledgment?: boolean;
    assessor_name?: string;
    assessor_signature?: string;
  };
}