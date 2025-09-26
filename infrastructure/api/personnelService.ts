import { Personnel } from '@/domain/entities/personnel';
import api from './axios';

// Get all personnels
export async function getPersonnelsUseCase(): Promise<Personnel[]> {
  return getPersonnelsApi();
}

export const getPersonnelsApi = async (): Promise<Personnel[]> => {
  const { data } = await api.get(`/personnels`);
  return data;
};