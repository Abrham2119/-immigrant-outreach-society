import { RegistrationFormClients } from '@/domain/entities/registration';
import api from './axios';
import { RegistrationFormClientsReception } from '@/domain/entities/registrationClient';

export async function registrationServiceClients(form: RegistrationFormClients): Promise<RegistrationFormClientsReception> {
  const { data } = await api.post('/clients/register-by-receptionist', form);
  return data;
}

