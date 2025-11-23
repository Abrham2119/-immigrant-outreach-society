import { useMutation, useQuery } from '@tanstack/react-query';
import { BookAppointmentRequest } from '@/domain/entities/appointment';
import { getAvailableSlotsUseCase, getExceptionsUseCase, getBookedAppointmentsUseCase, bookAppointmentUseCase } from '@/infrastructure/api/appointmentServiceClient';

export const useAvailableSlots = (personnelId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['availableSlots', personnelId, startDate, endDate],
    queryFn: () => getAvailableSlotsUseCase(personnelId, startDate, endDate),
    enabled: !!personnelId && !!startDate && !!endDate,
  });
};

export const useExceptions = () => {
  return useQuery({
    queryKey: ['exceptions'],
    queryFn: getExceptionsUseCase,
  });
};

export const useBookedAppointments = () => {
  return useQuery({
    queryKey: ['bookedAppointments'],
    queryFn: getBookedAppointmentsUseCase,
  });
};

export const useBookAppointment = () => {
  return useMutation({
    mutationFn: bookAppointmentUseCase,
  });
};