// domain/validation/contactNoteForm.schema.ts
import { z } from 'zod';

export const contactNoteFormSchema = z.object({
  clientFullName: z.string().min(1, "Client full name is required"),
  sqlStaffFullName: z.string().min(1, "SQL staff full name is required"),
  scope_of_service: z.array(z.string()).min(1, "At least one service scope must be selected"),
  clientNameForHosting: z.string().optional(),
  actionInformation: z.string().optional(),
  clientRequestToAction: z.string().optional(),
  clientAuditForHosting: z.string().optional(),
  partyDataStatus: z.string().optional(),
  appointmentStatus: z.string().optional(),
  acknowledgement: z.boolean().refine(val => val === true, "Acknowledgement is required"),
  signature: z.string().min(1, "Signature is required"),
  nameComposition: z.string().optional(),
  dateCompleted: z.string().optional(),
});

export type ContactNoteFormValues = z.infer<typeof contactNoteFormSchema>;