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

export const getRulesUseCase = async () => {
  const { data } = await api.get(`/rules`);
  return data;
};

// Rename this to avoid conflict
export const createRuleApi = async (rule: Rule) => {
  const { data } = await api.post(`/rules`, rule);
  return data;
};

export const getExceptionsUseCase = async (id: string | undefined) => {
  const { data } = await api.get(`/exceptions`);
  return data;
};




//exeptions 
export async function createExceptionUseCase(exception: Exception): Promise<Exception> {
  return createExceptionApi(exception);}

// export async function getExceptionsUseCase(personnelId?: string): Promise<Exception[]> {
//   return getExceptionsApi(personnelId);
// }

export async function deleteExceptionUseCase(exceptionId: string): Promise<{ message: string }> {
  return deleteExceptionApi(exceptionId);
}

export const createExceptionApi = async (exception: Exception) => {
  const { data } = await api.post(`/exceptions`, exception);
  return data;
};

export const getExceptionsApi = async (personnelId?: string) => {
  const { data } = await api.get(`/exceptions${personnelId ? `?personnelId=${personnelId}` : ''}`);
  return data;
};

export const deleteExceptionApi = async (exceptionId: string) => {
  const { data } = await api.delete(`/exceptions/${exceptionId}`);
  return data;
};



