// domain/validation/dischargeSummaryForm.schema.ts
import { z } from 'zod';

export const dischargeSummaryFormSchema = z.object({
  future_consideration: z.string().min(1, "Future consideration status is required"),
  detail_check: z.string().min(1, "Detail check status is required"),
  features: z.array(z.string()).min(1, "At least one feature must be selected"),
  key_features: z.array(z.string()).min(1, "At least one key feature must be selected"),
  other_attributes: z.array(z.string()).optional(),
  additional_information: z.string().optional(),
  documentation_status: z.string().optional(),
  acknowledgement_status: z.string().min(1, "Acknowledgement status is required"),
  output_status: z.string().min(1, "Output status is required"),
  doctor_signature: z.string().min(1, "Doctor signature is required"),
  patient_consent: z.string().min(1, "Patient consent is required"),
  discharge_date: z.string().min(1, "Discharge date is required"),
  final_acknowledgement: z.boolean().refine(val => val === true, "Final acknowledgement is required"),
});

export type DischargeSummaryFormValues = z.infer<typeof dischargeSummaryFormSchema>;