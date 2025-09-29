// domain/entities/psychosocialIntervention.ts
export interface PsychosocialInterventionForm {
  client: string;
  personnel: string;
  service: string;
  formData: {
    data_entry_personnel_full_name?: string;
    client_name?: string;
    modalities?: string[];
    other_agencies_programs_involved?: string;
    client_wants_for_housing?: string;
    acknowledgement?: boolean;
    ios_staff_full_name?: string;
    signature?: string;
    date_completed?: string;
  };
}

export interface PsychosocialInterventionResponse {
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


export interface PsychosocialInterventionFormPayload {
 client: string;
  personnel: string;
  service: string;
  formData: {
    data_entry_personnel_full_name?: string;
    client_name?: string;
    modalities?: string[];
    other_agencies_programs_involved?: string;
    client_wants_for_housing?: string;
    acknowledgement?: boolean;
    ios_staff_full_name?: string;
    signature?: string;
    date_completed?: string;
  };
}
