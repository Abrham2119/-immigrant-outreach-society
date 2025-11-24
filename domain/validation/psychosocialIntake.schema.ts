// domain/validation/psychosocialIntakeForm.schema.ts
import { z } from 'zod';

export const psychosocialIntakeFormSchema = z.object({
  data_entry_personnel_name: z.string().min(1, "Data entry personnel name is required"),
  date_of_assessment: z.string().min(1, "Date of assessment is required"),
  client_first_name: z.string().min(1, "Client first name is required"),
  client_last_name: z.string().min(1, "Client last name is required"),
  preferred_first_name: z.string().optional(),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  street_address: z.string().min(1, "Street address is required"),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  state_province_region: z.string().optional(),
  zip_postal_code: z.string().optional(),
  country: z.string().optional(),
  home_phone: z.string().min(1, "Home phone is required"),
  cell_phone: z.string().min(1, "Cell phone is required"),
  presenting_concerns: z.string().optional(),
  collateral_information: z.string().optional(),
  personal_family_history: z.string().optional(),
  addictions_substance_use: z.string().optional(),
  past_mental_health: z.string().optional(),
  medical_history_status: z.string().optional(),
  current_medications: z.string().optional(),
  risk_assessment: z.string().optional(),
  intervention_plan: z.string().optional(),
});

export type PsychosocialIntakeFormValues = z.infer<typeof psychosocialIntakeFormSchema>;