import { ExceptionsResponse, StatusUpdateRequest, StatusUpdateResponse } from '@/domain/entities/assesments/exception';
import api from './axios';

// Get exceptions with pagination and filters - Updated to match actual API
export const getExceptionsUseCase = async (
  page: number = 1,
  limit: number = 25,
  search: string = '',
  status: string = 'pending',
  type: string = 'all',
  personnelId?: string
): Promise<ExceptionsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && status !== 'all' && { status }),
    ...(type && type !== 'all' && { type }),
    ...(personnelId && { personnelId })
  });

  const { data } = await api.get(`/exceptions?${params}`);
  
  // Transform API response to match expected structure
  return {
    success: data.success,
    count: data.meta.count,
    total: data.meta.total,
    page: data.meta.page,
    pages: data.meta.totalPages,
    exceptions: data.data,
    meta: data.meta
  };
};

// Update exception status
export const updateExceptionStatusUseCase = async (
  exceptionId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> => {
  const { data } = await api.put(`/exceptions/status/${exceptionId}`, statusData);
  return data;
};