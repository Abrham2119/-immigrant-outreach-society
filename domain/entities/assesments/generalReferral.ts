// domain/entities/assesments/generalReferral.ts
export interface GeneralReferralFormData {
  data_entry_personnel_name: string;
  referral_date: string;
  referral_first_name: string;
  referral_last_name: string;
  date_of_birth: string;
  best_time_to_call?: string;
  email_address?: string;
  phone_number: string;
  call_any_time?: boolean;
  street_address: string;
  address_line_2?: string;
  city?: string;
  state_province_region?: string;
  zip_postal_code?: string;
  country?: string;
  referred_by_first_name: string;
  referred_by_last_name: string;
  referred_to_first_name: string;
  referred_to_last_name: string;
  reasons_for_referral?: string;
}

export interface GeneralReferralFormPayload {
  client: string;
  personnel: string;
  service: string;
  title: string;
  formData: GeneralReferralFormData;
}

export type GeneralReferralForm = GeneralReferralFormPayload;
export type GeneralReferralResponse = { message: string };