// infrastructure/api/appointmentService.ts
import axios from "axios";
import api from "./axios";
import { Appointment, Exception, Rule } from "@/domain/entities/appointment";



export const getAppointmentsUseCase = async () => {
  const { data } = await api.get(`/appointments`);
  return data;
};

export const getAppointmentByIdUseCase = async (id: string) => {
  const { data } = await axios.get(`/appointments/${id}`);
  return data;
};

export const createAppointmentUseCase = async (appointment: Appointment) => {
  const { data } = await api.post(`/appointments`, appointment);
  return data;
};

export const updateAppointmentUseCase = async (id: string, appointment: Appointment) => {
  const { data } = await api.put(`/appointments/${id}`, appointment);
  return data;
};

export const deleteAppointmentUseCase = async (id: string) => {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
};

export const cancelAppointmentUseCase = async (id: string) => {
  const { data } = await api.post(`/appointments/${id}/cancel`);
  return data;
};

// Rules API functions
export const getRulesUseCase = async (personnelId?: string): Promise<Rule[]> => {
  const { data } = await api.get(`/rules${personnelId ? `?personnelId=${personnelId}` : ''}`);
  return data.data; // Return data.data to match your API response structure
};

export const getRuleByIdUseCase = async (ruleId: string): Promise<Rule> => {
  const { data } = await api.get(`/rules/${ruleId}`);
  return data.data;
};

export const createRuleUseCase = async (rule: Rule): Promise<Rule> => {
  const { data } = await api.post(`/rules`, rule);
  return data.data;
};

export const updateRuleUseCase = async (ruleId: string, rule: Rule): Promise<Rule> => {
  const { data } = await api.put(`/rules/${ruleId}`, rule);
  return data.data;
};

export const deleteRuleUseCase = async (ruleId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/rules/${ruleId}`);
  return data;
};

// Exception API functions (keep as is)
export const createExceptionUseCase = async (exception: Exception): Promise<Exception> => {
  const { data } = await api.post(`/exceptions`, exception);
  return data;
};

export const getExceptionsUseCase = async (personnelId?: string): Promise<Exception[]> => {
  const { data } = await api.get(`/exceptions${personnelId ? `?personnelId=${personnelId}` : ''}`);
  return data;
};

export const updateExceptionUseCase = async (exceptionId: string, exception: Exception): Promise<Exception> => {
  const { data } = await api.put(`/exceptions/${exceptionId}`, exception);
  return data;
};

export const deleteExceptionUseCase = async (exceptionId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/exceptions/${exceptionId}`);
  return data;
};