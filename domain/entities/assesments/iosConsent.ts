export interface IOSConsentForm {
  client: string;
  personnel: string;
  service: string;
consentText?:string
  formData: {
    data_entry_personnel_name?: string;
    consent?: boolean;
    client_signature?: string;
    client_full_name?: string;
    client_date?: string;
    ios_staff_signature?: string;
    ios_staff_full_name?: string;
    ios_staff_date?: string;

  };
}

export interface IOSConsentResponse {
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

export interface IOSConsentFormPayload {
  client: string;
  personnel: string;
  service: string;
consentText?:string

  title: string;
  formData: {
    data_entry_personnel_name?: string;
    consent?: boolean;
    client_signature?: string;
    client_full_name?: string;
    client_date?: string;
    ios_staff_signature?: string;
    ios_staff_full_name?: string;
    ios_staff_date?: string;

  };
}