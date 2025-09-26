import { z } from "zod";

export const registrationFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["male", "female", "prefer_not_to_say"], {
    required_error: "Gender is required",
  }),
  mobileNumber: z
    .string()
    .min(10, "Mobile number is required"),
  // Optional fields
  dateOfBirth: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  nationality: z.string().optional(),
  immigrationStatus: z.string().optional(),
  language: z.string().optional(),
  address: z.string().optional(),
  message: z.string().optional(),
  
  // Required fields
  services: z.array(z.string()).min(1, "Select at least one service"),
  agreeToTerms: z.boolean().refine((val) => val, {
    message: "You must agree",
  }),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;