"use client";

import {
  useAllNotifications,
  useMarkAllAsSeen,
  useMarkAsDelivered,
  useMarkNotificationAsSeen,
  useMissedNotifications,
  useUnreadCount,
  useUnseenNotifications,
  useUpdateEmergencyAlertStatus
} from "@/application/hooks/useNotification";
import { Notification as NotificationType } from "@/domain/entities/notification";
import { AlertTriangle, Bell, CheckCircle, ChevronDown, Eye, Globe, Menu, RefreshCw, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useTranslation } from "../providers/translation.provider";

interface TopbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://appointment-figma.onrender.com";

const ALL_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', direction: 'ltr' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', direction: 'ltr' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', direction: 'ltr' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', direction: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
];

const Topbar = ({ isOpen, toggleMenu }: TopbarProps) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [realtimeAlerts, setRealtimeAlerts] = useState<NotificationType[]>([]);
  const [activeTab, setActiveTab] = useState<'unseen' | 'missed' | 'all'>('unseen');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const { t, currentLanguage, changeLanguage, isLoading } = useTranslation();
  const { data: session } = useSession();

  const user = session?.user;
  const userRole = user?.role;
  const userId = user?.id;
  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split('@')[0] || t('user', 'User');
  const isAdmin = userRole === 'Admin';

  const { data: unseenNotifications = [], refetch: refetchUnseen } = useUnseenNotifications();
  const { data: missedNotifications = [], refetch: refetchMissed } = useMissedNotifications();
  const { data: allNotifications = [], refetch: refetchAll } = useAllNotifications(1, 20);
  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useUnreadCount();

  const markAllAsSeenMutation = useMarkAllAsSeen();
  const markNotificationAsSeenMutation = useMarkNotificationAsSeen();
  const markAsDeliveredMutation = useMarkAsDelivered();
  const updateEmergencyAlertStatusMutation = useUpdateEmergencyAlertStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !session) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("connect_error", () => {
      setConnectionError("Failed to connect to notification server");
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("reconnect", () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("emergency_alert", (data: any) => {
      const newAlert: NotificationType = {
        _id: `emergency-${Date.now()}`,
        employeeId: data.employeeId || 'system',
        title: 'Emergency Alert Triggered',
        message: data.message || 'Emergency situation reported. Please take immediate action.',
        type: 'emergency_alert',
        relatedClient: data.clientId,
        delivered: false,
        seen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        client: data.client,
        employee: data.employee,
      };

      setRealtimeAlerts(prev => [newAlert, ...prev.slice(0, 9)]);

      // Fixed: Use window.Notification to avoid naming conflict
      if (typeof window !== 'undefined' && "Notification" in window && window.Notification.permission === "granted") {
        new window.Notification(t('emergencyAlert', 'Emergency Alert'), {
          body: data.message,
          icon: "/assets/canada.svg",
          tag: 'emergency',
        });
      } else if (typeof window !== 'undefined' && "Notification" in window && window.Notification.permission === "default") {
        window.Notification.requestPermission();
      }

      refetchUnreadCount();
      refetchUnseen();
    });

    // Fixed: Use window.Notification to avoid naming conflict
    if (typeof window !== "undefined" && "Notification" in window && window.Notification.permission === "default") {
      window.Notification.requestPermission();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [mounted, session, t, refetchUnreadCount, refetchUnseen]);

  useEffect(() => {
    if (showNotificationModal) {
      refetchUnreadCount();
      refetchUnseen();
      refetchMissed();
      if (isAdmin) {
        refetchAll();
      }
    }
  }, [showNotificationModal, refetchUnreadCount, refetchUnseen, refetchMissed, refetchAll, isAdmin]);

  const handleMarkAllAsSeen = () => {
    markAllAsSeenMutation.mutate(undefined, {
      onSuccess: () => {
        refetchUnreadCount();
        refetchUnseen();
      }
    });
  };

  const handleMarkNotificationAsSeen = (notificationId: string) => {
    markNotificationAsSeenMutation.mutate(notificationId, {
      onSuccess: () => {
        refetchUnreadCount();
        refetchUnseen();
      }
    });
  };

  const handleMarkAsDelivered = () => {
    markAsDeliveredMutation.mutate();
  };

  const handleEmergencyAlertStatus = (clientId: string) => {
    if (clientId) {
      updateEmergencyAlertStatusMutation.mutate(clientId);
    }
  };

  const formatTime = (timestamp: string) => {
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

    return date.toLocaleDateString(currentLanguage, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string, delivered: boolean, seen: boolean) => {
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

  const getNotificationStatus = (delivered: boolean, seen: boolean) => {
    if (!delivered) return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (!seen) return { text: 'Unread', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Read', color: 'bg-green-100 text-green-800' };
  };

  const getCurrentNotifications = () => {
    switch (activeTab) {
      case 'unseen': return unseenNotifications;
      case 'missed': return missedNotifications;
      case 'all': return isAdmin ? allNotifications : [];
      default: return unseenNotifications;
    }
  };

  const closeModals = () => {
    setShowNotificationModal(false);
    setShowLanguageDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode as any);
    setShowLanguageDropdown(false);
    if (typeof document !== 'undefined') {
      const isRTL = languageCode === 'ar';
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  const currentLang = ALL_LANGUAGES.find(lang => lang.code === currentLanguage) || ALL_LANGUAGES[0];
  const currentLangName = currentLang.nativeName || currentLang.name;
  const currentLangFlag = currentLang.flag;

  const showUnreadBadge = mounted && unreadCount > 0;
  const showConnectionBadge = mounted;

  return (
    <>
      {showNotificationModal && (
        <div onClick={closeModals} className="fixed inset-0 z-40" />
      )}
      <div className="sticky top-0 z-50 w-full h-[65px] flex items-center justify-between bg-white border-b border-[#C4C4C4] px-3 md:px-6">
        <div className="flex items-center">
          <button
            className="md:hidden px-2 rounded-md bg-transparent"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Image src="/assets/canada.svg" alt="Immigration Logo" className="w-auto h-14" width={100} height={100} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label={t('notifications', 'Notifications')}
            >
              <Bell size={20} className="text-gray-600" />

              {showUnreadBadge && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}

              {showConnectionBadge && (
                <span
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                  title={isConnected ? t('connected', 'Connected') : t('disconnected', 'Disconnected')}
                />
              )}
            </button>

            {mounted && showNotificationModal && (
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

                      {/* <button
                        onClick={handleMarkAsDelivered}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={markAsDeliveredMutation.isPending}
                      >
                        Mark as Delivered
                      </button> */}
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
                    {/* <button
                      onClick={() => setActiveTab('missed')}
                      className={`flex-1 py-2 text-center font-medium ${activeTab === 'missed' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Missed ({missedNotifications.length})
                    </button> */}
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

                <div className="overflow-y-auto max-h-[400px]">
                  {getCurrentNotifications().length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {getCurrentNotifications().map((notification) => {
                        const status = getNotificationStatus(notification.delivered, notification.seen);
                        return (
                          <div
                            key={notification._id}
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
                                      {formatTime(notification.createdAt)}
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
                      })}
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

                  {realtimeAlerts.length > 0 && (
                    <div className="border-t border-gray-200">
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          Real-time Alerts ({realtimeAlerts.length})
                        </h4>
                        <div className="space-y-2">
                          {realtimeAlerts.slice(0, 3).map((alert) => (
                            <div
                              key={alert._id}
                              className="p-3 bg-red-50 rounded-lg border border-red-200"
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle size={16} className="text-red-600" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                                  {alert.client && (
                                    <p className="text-xs text-gray-600 mt-1">
                                      Client: {alert.client.firstName} {alert.client.lastName}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatTime(alert.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {getCurrentNotifications().length} notifications • {unreadCount} unread
                    </div>
                    <div className="text-xs text-gray-400">
                      {isConnected ? 'Live updates active' : 'Live updates paused'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t('changelanguage', 'Change language')}
              disabled={isLoading}
            >
              <Globe size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">{currentLangFlag} {currentLangName}</span>
              <ChevronDown size={16} className="text-gray-500" />
              {isLoading && (
                <span className="ml-1 h-2 w-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>
              )}
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('language', 'Language')}
                  </div>
                  {ALL_LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors ${currentLanguage === language.code ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                        }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-sm font-medium text-gray-700">{language.nativeName}</span>
                        <span className="text-xs text-gray-500">{language.name}</span>
                      </div>
                      {currentLanguage === language.code && (
                        <span className="text-blue-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User profile"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole || t('user', 'User')}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500 capitalize">{userRole || t('user', 'User')}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700">
                    <User size={16} />
                    {t('myprofile', 'My Profile')}
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('settings', 'Settings')}
                  </button>
                  <button
                    onClick={() => signOut({ redirect: false })}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('logout', 'Logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(showNotificationModal || showLanguageDropdown || showProfileDropdown) && (
        <div onClick={closeModals} className="fixed inset-0 z-40" />
      )}
    </>
  );
};

export default Topbar;