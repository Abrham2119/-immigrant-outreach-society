import { z } from 'zod';

export const appointmentSchema = z.object({
  client: z.string().min(1, 'Client ID is required'),
  personnel: z.string().min(1, 'Personnel ID is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  remark: z.string().optional(),
});

export type AppointmentFormSchema = z.infer<typeof appointmentSchema>;