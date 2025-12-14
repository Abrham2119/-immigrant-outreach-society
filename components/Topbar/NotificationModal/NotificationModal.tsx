import { Notification as NotificationType } from "@/domain/entities/notification";
import { AlertTriangle, Bell, CheckCircle, RefreshCw } from "lucide-react";
import { formatTime } from "../utils/notification.utils";
import { NotificationItem } from "./NotificationItem";

interface NotificationModalProps {
  t: (key: string, fallback: string) => string;
  currentLanguage: string;
  isAdmin: boolean;
  isConnected: boolean;
  connectionError: string | null;
  unreadCount: number;
  unseenNotifications: NotificationType[];
  missedNotifications: NotificationType[];
  allNotifications: NotificationType[];
  realtimeAlerts: NotificationType[];
  activeTab: 'unseen' | 'missed' | 'all';
  setActiveTab: (tab: 'unseen' | 'missed' | 'all') => void;
  markAllAsSeenMutation: {
    isPending: boolean;
    mutate: (data?: any) => void;
  };
  markNotificationAsSeenMutation: {
    isPending: boolean;
    mutate: (id: string) => void;
  };
  markAsDeliveredMutation: {
    isPending: boolean;
    mutate: () => void;
  };
  updateEmergencyAlertStatusMutation: {
    isPending: boolean;
    mutate: (payload: { clientId: string; emergency_alert: boolean; reason: string }) => void;
  };
  refetchUnreadCount: () => void;
  refetchUnseen: () => void;
  refetchMissed: () => void;
  refetchAll: () => void;
  handleMarkAllAsSeen: () => void;
  handleMarkNotificationAsSeen: (id: string) => void;
  handleMarkAsDelivered: () => void;
  handleEmergencyAlertStatus: (clientId: string) => void;
}

export const NotificationModal = ({
  t,
  currentLanguage,
  isAdmin,
  isConnected,
  connectionError,
  unreadCount,
  unseenNotifications,
  missedNotifications,
  allNotifications,
  realtimeAlerts,
  activeTab,
  setActiveTab,
  markAllAsSeenMutation,
  markNotificationAsSeenMutation,
  markAsDeliveredMutation,
  updateEmergencyAlertStatusMutation,
  refetchUnreadCount,
  refetchUnseen,
  refetchMissed,
  refetchAll,
  handleMarkAllAsSeen,
  handleMarkNotificationAsSeen,
  handleMarkAsDelivered,
  handleEmergencyAlertStatus
}: NotificationModalProps) => {
  const getCurrentNotifications = () => {
    switch (activeTab) {
      case 'unseen': return unseenNotifications;
      case 'missed': return missedNotifications;
      case 'all': return isAdmin ? allNotifications : [];
      default: return unseenNotifications;
    }
  };

  const currentNotifications = getCurrentNotifications();

  return (
    <div className="absolute right-0 top-full mt-2 w-[500px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-lg">{t('notifications', 'Notifications')}</h3>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <strong>{t('unreadCount', 'Unread Count')}:</strong>
                <span className="ml-2 font-bold text-lg text-blue-600">{unreadCount}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <p className="text-xs text-gray-500">
                  {isConnected
                    ? t('connected', 'Connected')
                    : t('disconnected', 'Disconnected')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  refetchUnreadCount();
                  refetchUnseen();
                  refetchMissed();
                  if (isAdmin) refetchAll();
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsSeen}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={markAllAsSeenMutation.isPending}
                >
                  <CheckCircle size={14} />
                  {t('markAllAsSeen', 'Mark All Seen')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('unseen')}
            className={`flex-1 py-2 text-center font-medium ${activeTab === 'unseen'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Unseen ({unseenNotifications.length})
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 text-center font-medium ${activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              All ({allNotifications.length})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto pb-8 max-h-[400px]">
        {currentNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {currentNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                t={t}
                currentLanguage={currentLanguage}
                isAdmin={isAdmin}
                handleMarkNotificationAsSeen={handleMarkNotificationAsSeen}
                handleEmergencyAlertStatus={handleEmergencyAlertStatus}
                markNotificationAsSeenMutation={markNotificationAsSeenMutation}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {activeTab === 'unseen' && t('nonotifications', 'No unseen notifications')}
              {activeTab === 'missed' && 'No missed notifications'}
              {activeTab === 'all' && 'No notifications'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {connectionError || t('notificationsWillAppearHere', 'Notifications will appear here')}
            </p>
          </div>
        )}


      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {currentNotifications.length} notifications • {unreadCount} unread
          </div>
          <div className="text-xs text-gray-400">
            {isConnected ? 'Live updates active' : 'Live updates paused'}
          </div>
        </div>
      </div>
    </div>
  );
};