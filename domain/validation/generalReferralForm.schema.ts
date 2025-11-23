// domain/validation/generalReferralForm.schema.ts
import { z } from 'zod';

export const generalReferralFormSchema = z.object({
  data_entry_personnel_name: z.string().min(1, "Data entry personnel name is required"),
  referral_date: z.string().min(1, "Referral date is required"),
  referral_first_name: z.string().min(1, "Referral first name is required"),
  referral_last_name: z.string().min(1, "Referral last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  best_time_to_call: z.string().optional(),
  email_address: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone_number: z.string().min(1, "Phone number is required"),
  call_any_time: z.boolean().optional(),
  street_address: z.string().min(1, "Street address is required"),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  state_province_region: z.string().optional(),
  zip_postal_code: z.string().optional(),
  country: z.string().optional(),
  referred_by_first_name: z.string().min(1, "Referred by first name is required"),
  referred_by_last_name: z.string().min(1, "Referred by last name is required"),
  referred_to_first_name: z.string().min(1, "Referred to first name is required"),
  referred_to_last_name: z.string().min(1, "Referred to last name is required"),
  reasons_for_referral: z.string().optional(),
});

export type GeneralReferralFormValues = z.infer<typeof generalReferralFormSchema>;