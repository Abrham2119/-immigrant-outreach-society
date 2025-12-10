import { getAllNotificationsUseCase,
  getUnseenNotificationsUseCase,
  getMissedNotificationsUseCase,
  getUnreadCountUseCase,
  markAllAsSeenUseCase,
  markNotificationAsSeenUseCase,
  markAsDeliveredUseCase,
  updateEmergencyAlertStatusUseCase } from '@/infrastructure/api/notificationService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export const useAllNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['notifications', 'all', page, limit],
    queryFn: () => getAllNotificationsUseCase(page, limit),
    enabled: false,
  });
};

export const useUnseenNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['notifications', 'unseen', page, limit],
    queryFn: () => getUnseenNotificationsUseCase(page, limit),
  });
};

export const useMissedNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['notifications', 'missed', page, limit],
    queryFn: () => getMissedNotificationsUseCase(page, limit),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCountUseCase,
    refetchInterval: 30000,
  });
};

export const useMarkAllAsSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllAsSeenUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkNotificationAsSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsSeenUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
};

export const useMarkAsDelivered = () => {
  return useMutation({
    mutationFn: markAsDeliveredUseCase,
  });
};

export const useUpdateEmergencyAlertStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateEmergencyAlertStatusUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};