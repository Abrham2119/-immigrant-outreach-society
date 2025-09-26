import { useMutation, useQuery, UseMutationResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
    AvailableSpot,
    Exception,
    Appointment,
    BookAppointmentRequest,
    BookAppointmentResponse
} from '@/domain/entities/appointment';
import {
    getAvailableSlotsUseCase,
    getExceptionsUseCase,
    getBookedAppointmentsUseCase,
    bookAppointmentUseCase
} from '@/infrastructure/api/appointmentServiceClient';

export function useAppointmentManagement() {
    const queryClient = useQueryClient();

    // Get available slots query
    const useAvailableSlots = (personnelId: string, startDate: string, endDate: string) => {
        return useQuery({
            queryKey: ['availableSlots', personnelId, startDate, endDate],
            queryFn: () => getAvailableSlotsUseCase(personnelId, startDate, endDate),
            enabled: !!personnelId && !!startDate && !!endDate,
        });
    };

    // Get exceptions query
    const useExceptions = () => {
        return useQuery({
            queryKey: ['exceptions'],
            queryFn: getExceptionsUseCase,
        });
    };

    // Get booked appointments query
    const useBookedAppointments = () => {
        return useQuery({
            queryKey: ['bookedAppointments'],
            queryFn: getBookedAppointmentsUseCase,
        });
    };

    // Book appointment mutation
    const bookAppointmentMutation: UseMutationResult<BookAppointmentResponse, AxiosError, BookAppointmentRequest> = useMutation({
        mutationFn: bookAppointmentUseCase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availableSlots'] });
            queryClient.invalidateQueries({ queryKey: ['exceptions'] });
            queryClient.invalidateQueries({ queryKey: ['bookedAppointments'] });
        },
        onError: (error: AxiosError) => {
            console.error("Error booking appointment:", error.message);
        },
    });

    return {
        useAvailableSlots,
        useExceptions,
        useBookedAppointments,
        bookAppointmentMutation,
    };
}