// Keep EXACTLY as you have them
export const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'With Personnel', value: 'with_personnel' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
] as const;

export const SERVICES = [
  { value: "PCO", label: "Proactive Community Outreach" },
  { value: "Wellness", label: "Wellness Intervention" },
  { value: "IOCR", label: "Immigration Crisis Response" },
  { value: "Settlement", label: "Settlement & Integration" },
  { value: "Psychosocial", label: "Psychosocial Wellbeing" },
  { value: "Youth", label: "Youth Program" },
  { value: "SALP", label: "Senior Active Living Program (SALP)" },
  { value: "GBV", label: "Gender-Based Violence (GBV) Program" },
  { value: "Training", label: "Training and Workshops" },
  { value: "Policy", label: "Policy Influencing and Advocacy for Antiracism Initiatives" }
] as const;