import { z } from "zod";

export const psychosocialFormSchema = z.object({
  // Required fields
  dataEntryPersonnelFullName: z.string().min(1, "Data entry personnel name is required"),
  clientName: z.string().min(1, "Client name is required"),
  
  // Optional fields
  modalities: z.array(z.string()).optional(),
  otherAgencies: z.string().optional(),
  clientHousingWants: z.string().optional(),
  acknowledgement: z.boolean().optional(),
  iosStaffFullName: z.string().optional(),
  signature: z.string().optional(),
  dateCompleted: z.string().optional(),
});

export type PsychosocialFormValues = z.infer<typeof psychosocialFormSchema>;