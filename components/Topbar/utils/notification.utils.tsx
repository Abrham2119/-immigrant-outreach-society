import { AlertTriangle, Bell, CheckCircle, Eye } from "lucide-react";
import React from "react";

export const formatTime = (timestamp: string, t: (key: string, fallback: string) => string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('justNow', 'Just now');
  if (diffMins < 60) return `${diffMins}${t('minutesAgo', 'm ago')}`;
  if (diffHours < 24) return `${diffHours}${t('hoursAgo', 'h ago')}`;
  if (diffDays < 7) return `${diffDays}${t('daysAgo', 'd ago')}`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getNotificationIcon = (type: string, delivered: boolean, seen: boolean): React.ReactNode => {
  if (type === 'emergency_alert') {
    return (
      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle size={18} className="text-red-600" />
      </div>
    );
  }
  if (!delivered) {
    return (
      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
        <Bell size={18} className="text-yellow-600" />
      </div>
    );
  }

  if (!seen) {
    return (
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <Eye size={18} className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
      <CheckCircle size={18} className="text-green-600" />
    </div>
  );
};

export const getNotificationStatus = (delivered: boolean, seen: boolean) => {
  if (!delivered) return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
  if (!seen) return { text: 'Unread', color: 'bg-blue-100 text-blue-800' };
  return { text: 'Read', color: 'bg-green-100 text-green-800' };
};