import api from './axios';
import { RegistrationFormClients, RegistrationFormResponse } from '@/domain/entities/registration';

export async function registerUser(form: RegistrationFormClients): Promise<RegistrationFormResponse> {
  const { data } = await api.post('/clients/register', form);
  return data;
}
