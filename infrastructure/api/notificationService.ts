import {
  ClientAlertResponse,
  MarkSeenResponse,
  Notification,
  NotificationResponse,
  UnreadCountResponse
} from '@/domain/entities/notification';
import api from './axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateEmergencyAlertPayload {
  clientId?: string;
  emergency_alert: boolean;
  reason: string;
}
export const getAllNotificationsUseCase = async (page: number = 1, limit: number = 20): Promise<Notification[]> => {
  const { data } = await api.get<NotificationResponse>(`${BASE_URL}/notifications/all`, {
    params: { page, limit }
  });
  return data.data;
};

export const getUnseenNotificationsUseCase = async (page: number = 1, limit: number = 20): Promise<Notification[]> => {
  const { data } = await api.get<NotificationResponse>(`${BASE_URL}/notifications/unseen`, {
    params: { page, limit }
  });
  return data.data;
};

export const getMissedNotificationsUseCase = async (page: number = 1, limit: number = 20): Promise<Notification[]> => {
  const { data } = await api.get<NotificationResponse>(`${BASE_URL}/notifications/missed`, {
    params: { page, limit }
  });
  return data.data;
};

export const getUnreadCountUseCase = async (): Promise<number> => {
  const { data } = await api.get<UnreadCountResponse>(`${BASE_URL}/notifications/unread-count`);
  return data.count;
};

export const markAllAsSeenUseCase = async (): Promise<void> => {
  await api.put<MarkSeenResponse>(`${BASE_URL}/notifications/mark-seen`, {});
};

export const markNotificationAsSeenUseCase = async (notificationId: string): Promise<void> => {
  await api.put<MarkSeenResponse>(`${BASE_URL}/notifications/mark-seen/${notificationId}`, {});
};

export const markAsDeliveredUseCase = async (): Promise<void> => {
  await api.put<MarkSeenResponse>(`${BASE_URL}/notifications/delivered`, {});
};



export const updateEmergencyAlertStatusUseCase = async (
  payload: UpdateEmergencyAlertPayload
): Promise<ClientAlertResponse> => {
  const { clientId, emergency_alert, reason } = payload;
  
  if (!reason || reason.trim().length < 3) {
    throw new Error('Reason is required and must be at least 3 characters');
  }

  const { data } = await api.put<ClientAlertResponse>(
    `${BASE_URL}/clients/alert/status/${clientId}`,
    {
      emergency_alert,
      reason: reason.trim()
    }
  );
  return data;
};