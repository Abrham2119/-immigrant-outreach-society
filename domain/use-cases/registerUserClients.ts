import { registrationServiceClients } from '@/infrastructure/api/registrationServiceClients';
import { RegistrationFormClientsReceptForm } from '../entities/registrationClient';

export async function registerUserUseCase(form: RegistrationFormClientsReceptForm): Promise<{ message: string }> {
  return registrationServiceClients(form);
}
