import { z } from 'zod';

export const contactNoteFormSchema = z.object({
  data_entry_personnel_name: z.string().min(1, "Data entry personnel name is required"),
  client_first_name: z.string().min(1, "Client first name is required"),
  client_last_name: z.string().min(1, "Client last name is required"),
  ios_staff_first_name: z.string().min(1, "IOS staff first name is required"),
  ios_staff_last_name: z.string().min(1, "IOS staff last name is required"),
  date_of_contact: z.string().min(1, "Date of contact is required"),
  client_concerns: z.string().optional(),
  interventions: z.string().optional(),
  client_response: z.string().optional(),
  future_actions: z.string().optional(),
  date_of_next_appointment: z.string().min(1, "Date of next appointment is required"),
  acknowledgement_name: z.string().min(1, "Acknowledgement name is required"),
  acknowledgement_signature: z.string().min(1, "Signature is required"),
  date_completed: z.string().min(1, "Date completed is required"),
});

export type ContactNoteFormValues = z.infer<typeof contactNoteFormSchema>;