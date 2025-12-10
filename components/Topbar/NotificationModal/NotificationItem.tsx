import { Notification as NotificationType } from "@/domain/entities/notification";
import { AlertTriangle, Bell, Eye } from "lucide-react";
import { getNotificationIcon, getNotificationStatus, formatTime } from "../utils/notification.utils";

interface NotificationItemProps {
  notification: NotificationType;
  t: (key: string, fallback: string) => string;
  currentLanguage: string;
  isAdmin: boolean;
  handleMarkNotificationAsSeen: (id: string) => void;
  handleEmergencyAlertStatus: (clientId: string) => void;
  markNotificationAsSeenMutation: {
    isPending: boolean;
  };
}

export const NotificationItem = ({
  notification,
  t,
  currentLanguage,
  isAdmin,
  handleMarkNotificationAsSeen,
  handleEmergencyAlertStatus,
  markNotificationAsSeenMutation
}: NotificationItemProps) => {
  const status = getNotificationStatus(notification.delivered, notification.seen);

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${notification.type === 'emergency_alert' ? 'bg-red-50' : ''}`}
    >
      <div className="flex gap-3">
        {getNotificationIcon(notification.type, notification.delivered, notification.seen)}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className={`font-medium truncate ${notification.type === 'emergency_alert' ? 'text-red-700' : 'text-gray-800'}`}>
              {notification.title || 'Notification'}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                {status.text}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(notification.createdAt, t)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

          {notification.client && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium">
                    {notification.client.firstName} {notification.client.lastName}
                  </p>
                  {notification.client.emergency_alert && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={10} />
                      Emergency Active
                    </span>
                  )}
                </div>
                {notification.relatedClient && !notification.client.emergency_alert && (
                  <button
                    onClick={() => handleEmergencyAlertStatus(notification.relatedClient!)}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Set Emergency
                  </button>
                )}
              </div>
            </div>
          )}

          {notification.employee && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Sent by</p>
              <p className="text-sm font-medium">
                {notification.employee.firstName} {notification.employee.lastName}
                <span className="ml-2 text-xs text-gray-500">({notification.employee.role})</span>
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            {!notification.seen && (
              <button
                onClick={() => handleMarkNotificationAsSeen(notification._id || "")}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                disabled={markNotificationAsSeenMutation.isPending}
              >
                <Eye size={12} />
                Mark as Read
              </button>
            )}
            <div className="flex items-center gap-2">
              {!notification.delivered && (
                <span className="text-xs text-yellow-600 flex items-center gap-1">
                  <Bell size={12} />
                  Pending Delivery
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};