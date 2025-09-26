import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchDoctors, 
  createDoctor, 
  getDoctorById, 
  updateDoctor, 
  deleteDoctor,
  updateDoctorAvailability
} from '@/infrastructure/api/doctorService';
import { DoctorListResponse, CreateDoctorRequest, UpdateDoctorRequest } from '@/domain/entities/doctor';

export const useDoctors = (query: string) => {
  return useQuery({
    queryKey: ['doctors', query],
    queryFn: () => fetchDoctors(query),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorData: CreateDoctorRequest) => createDoctor(doctorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

export const useUpdateDoctorAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      updateDoctorAvailability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};