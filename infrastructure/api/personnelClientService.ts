import { PersonnelFormsResponse } from '@/domain/entities/assesments/personnelClient';
import api from './axios';

export const getClientsByPersonnelUseCase = async (
    page: number = 1,
    pageSize: number = 10,
    search: string = ''
): Promise<PersonnelFormsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search && { search })
    });

    const { data } = await api.get(`/forms/client?${params}`);
    return data;
};