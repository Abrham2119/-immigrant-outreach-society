import { 
  AssessmentListResponse, 
  CreateAssessmentRequest,
  Assessment 
} from "@/domain/entities/assessment";
import api from "./axios";

export async function fetchAssessments(query?: string): Promise<AssessmentListResponse> {
  const { data } = await api.get(`/admin/assessments?${query}`);
  return data;
}

export async function createAssessment(assessmentData: CreateAssessmentRequest): Promise<Assessment> {
  const { data } = await api.post('/admin/assessments', assessmentData);
  return data;
}

export async function getAssessmentById(id: string): Promise<Assessment> {
  const { data } = await api.get(`/admin/assessments/${id}`);
  return data;
}

export async function updateAssessment(id: string, assessmentData: any): Promise<Assessment> {
  const { data } = await api.put(`/admin/assessments/${id}`, assessmentData);
  return data;
}