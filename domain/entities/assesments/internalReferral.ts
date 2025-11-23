// domain/entities/assesments/internalReferral.ts
export interface InternalReferralFormData {
  data_entry_personnel_name: string;
  referral_date: string;
  referral_first_name: string;
  referral_last_name: string;
  date_of_birth: string;
  phone_number: string;
  best_date_to_call?: string;
  best_time_to_call?: string;
  email_address: string;
  street_address?: string;
  address_line_2?: string;
  city?: string;
  state_province_region?: string;
  zip_postal_code?: string;
  referred_by_first_name: string;
  referred_by_last_name: string;
  referred_to_first_name: string;
  referred_to_last_name: string;
  reasons_for_referral: string;
}

export interface InternalReferralFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: InternalReferralFormData;
}

export type InternalReferralForm = InternalReferralFormPayload;
export type InternalReferralResponse = { message: string };