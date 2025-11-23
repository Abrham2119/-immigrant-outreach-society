// domain/entities/assesments/referralForm.ts
export interface ReferralForm {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: {
    data_entry_percentual_full_name?: string;
    referral_date?: string;
    referral_individual_name?: string;
    status_date?: string;
    referral_individual_dob?: string;
    best_time_to_call?: string;
    call_any_time?: boolean;
    referral_email?: string;
    referral_shared_address?: string;
    postal_code?: string;
    city?: string;
    phone_number?: string;
    reference_to?: string;
    reasons_for_referral?: string;
    referral_type?: string[];
    priority?: string;
    status?: string;
    additional_notes?: string;
  };
}

export interface ReferralFormResponse {
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

export interface ReferralFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: {
    data_entry_percentual_full_name?: string;
    referral_date?: string;
    referral_individual_name?: string;
    status_date?: string;
    referral_individual_dob?: string;
    best_time_to_call?: string;
    call_any_time?: boolean;
    referral_email?: string;
    referral_shared_address?: string;
    postal_code?: string;
    city?: string;
    phone_number?: string;
    reference_to?: string;
    reasons_for_referral?: string;
    referral_type?: string[];
    priority?: string;
    status?: string;
    additional_notes?: string;
  };
}