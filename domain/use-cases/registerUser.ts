import { registerUser } from '@/infrastructure/api/registrationService';
import { RegistrationFormClients } from '../entities/registration';

export async function registerUserUseCase(form: RegistrationFormClients): Promise<{ message: string }> {
  return registerUser(form);
}
