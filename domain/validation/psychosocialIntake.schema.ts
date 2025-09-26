// domain/validation/psychosocialIntake.schema.ts
import { z } from "zod";

export const psychosocialIntakeSchema = z.object({
  // Required fields
  clientName: z.string().min(1, "Client name is required"),
  dateOfAssessment: z.string().min(1, "Date of assessment is required"),
  
  // Personal Information
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  immigrationStatus: z.string().optional(),
  language: z.string().optional(),
  
  // Contact Information
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  emergencyContact: z.string().optional(),
  
  // Assessment Information
  presentingProblem: z.string().optional(),
  medicalHistory: z.string().optional(),
  mentalHealthHistory: z.string().optional(),
  substanceUseHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  socialSupport: z.string().optional(),
  currentMedications: z.string().optional(),
  strengthsResources: z.string().optional(),
  riskAssessment: z.string().optional(),
  
  // Service Information
  referredBy: z.string().optional(),
  servicesRequested: z.array(z.string()).optional(),
  
  // Consent
  consentToTreatment: z.boolean().optional(),
  confidentialityAcknowledgment: z.boolean().optional(),
  
  // Staff Information
  assessorName: z.string().optional(),
  assessorSignature: z.string().optional(),
});

export type PsychosocialIntakeValues = z.infer<typeof psychosocialIntakeSchema>;