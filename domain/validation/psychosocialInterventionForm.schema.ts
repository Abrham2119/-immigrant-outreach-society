// domain/validation/psychosocialInterventionForm.schema.ts
import { z } from 'zod';

export const psychosocialInterventionFormSchema = z.object({
  data_entry_personnel_name: z.string().min(1, "Data entry personnel name is required"),
  client_first_name: z.string().min(1, "Client first name is required"),
  client_last_name: z.string().min(1, "Client last name is required"),
  ios_staff_first_name: z.string().min(1, "IOS staff first name is required"),
  ios_staff_last_name: z.string().min(1, "IOS staff last name is required"),
  date: z.string().min(1, "Date is required"),
  goals: z.string().min(1, "Goals are required"),
  modalities: z.array(z.string()).optional(),
  other_agencies_programs: z.string().optional(),
  acknowledgement_name: z.string().min(1, "Acknowledgement name is required"),
  signature: z.string().min(1, "Signature is required"),
  date_completed: z.string().min(1, "Date completed is required"),
});

export type PsychosocialInterventionFormValues = z.infer<typeof psychosocialInterventionFormSchema>;