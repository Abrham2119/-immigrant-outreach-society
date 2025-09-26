export type AssessmentType = 
  | "initial_contact_note"
  | "intake_assessment"
  | "general_assessment"
  | "group_contact_notes"
  | "psychological_assessment"
  | "social_history"
  | "psychosocial_intervention";

export interface Assessment {
  _id: string;
  clientId: string;
  doctorId: string;
  type: AssessmentType;
  date: string;
  content: any;  
  status: "draft" | "completed" | "submitted";
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentListResponse {
  data: Assessment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateAssessmentRequest {
  clientId: string;
  doctorId: string;
  type: AssessmentType;
  content: any;
}