// domain/validation/dischargeSummaryForm.schema.ts
import { z } from 'zod';

export const dischargeSummaryFormSchema = z.object({
  data_entry_personnel_name: z.string().min(1, "Data entry personnel name is required"),
  client_first_name: z.string().min(1, "Client first name is required"),
  client_last_name: z.string().min(1, "Client last name is required"),
  ios_staff_first_name: z.string().min(1, "IOS staff first name is required"),
  ios_staff_last_name: z.string().min(1, "IOS staff last name is required"),
  date_of_discharge: z.string().min(1, "Date of discharge is required"),
  goals_and_concerns: z.string().min(1, "Goals and concerns are required"),
  summary_of_care_provided: z.string().min(1, "Summary of care provided is required"),
  updated_risk_assessment: z.string().optional(),
  reason_for_discharge: z.string().optional(),
  recommendations_for_follow_up: z.string().optional(),
  acknowledgement_name: z.string().min(1, "Acknowledgement name is required"),
  acknowledgement_signature: z.string().optional(),
  date_completed: z.string().min(1, "Date completed is required"),
});

export type DischargeSummaryFormValues = z.infer<typeof dischargeSummaryFormSchema>;