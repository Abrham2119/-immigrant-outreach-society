// domain/validation/groupContactNoteForm.schema.ts
import { z } from 'zod';

export const groupContactNoteFormSchema = z.object({
  data_entry_personnel_name: z.string().min(1, "Data entry personnel name is required"),
  group_name: z.string().min(1, "Group name is required"),
  ios_staff_1_first_name: z.string().optional(),
  ios_staff_1_last_name: z.string().optional(),
  ios_staff_2_first_name: z.string().optional(),
  ios_staff_2_last_name: z.string().optional(),
  ios_staff_3_first_name: z.string().optional(),
  ios_staff_3_last_name: z.string().optional(),
  duration_minutes: z.number().min(1, "Duration must be at least 1 minute"),
  method_of_contact: z.array(z.string()).min(1, "At least one method of contact must be selected"),
  other_method_explanation: z.string().optional(),
  participants: z.string().optional(),
  acknowledgement_first_name: z.string().optional(),
  acknowledgement_last_name: z.string().optional(),
  signature: z.string().optional(),
  date_completed: z.string().min(1, "Date completed is required"),
});

export type GroupContactNoteFormValues = z.infer<typeof groupContactNoteFormSchema>;