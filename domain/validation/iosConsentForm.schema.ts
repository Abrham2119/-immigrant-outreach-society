import { z } from "zod";

export const iosConsentFormSchema = z.object({
  dataEntryPersonnelName: z.string().min(1, "Required"),
  consent: z.boolean().refine(val => val === true, "Must consent"),
  clientSignature: z.string().min(1, "Signature is required"),
  clientFullName: z.string().min(1, "Required"),
  clientDate: z.string().min(1, "Required"),
  iosStaffSignature: z.string().min(1, "Signature is required"),
  iosStaffFullName: z.string().min(1, "Required"),
  iosStaffDate: z.string().min(1, "Required"),
});

export type IOSConsentFormValues = z.infer<typeof iosConsentFormSchema>;