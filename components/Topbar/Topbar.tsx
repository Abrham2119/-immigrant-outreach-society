"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslation } from "../providers/translation.provider";
import { Notification as NotificationType } from "@/domain/entities/notification";
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
import { Bell, ChevronDown, Globe, Menu, User, X } from "lucide-react";
import { SocketManager } from "./SocketManager/SocketManager";
import { NotificationModal } from "./NotificationModal/NotificationModal";
import { LanguageDropdown } from "./LanguageDropdown/LanguageDropdown";
import { ProfileDropdown } from "./ProfileDropdown/ProfileDropdown";
import { ALL_LANGUAGES } from "./constants/languages.constants";

interface TopbarProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

export const Topbar = ({ isOpen, toggleMenu }: TopbarProps) => {
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [realtimeAlerts, setRealtimeAlerts] = useState<NotificationType[]>([]);
    const [activeTab, setActiveTab] = useState<'unseen' | 'missed' | 'all'>('unseen');
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

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
        updateEmergencyAlertStatusMutation.mutate({
            clientId,
            emergency_alert: false,
            reason: "Emergency alert status updated" // Add appropriate reason
        });
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

            <SocketManager
                session={session}
                mounted={mounted}
                t={t}
                refetchUnreadCount={refetchUnreadCount}
                refetchUnseen={refetchUnseen}
                setRealtimeAlerts={setRealtimeAlerts}
                setIsConnected={setIsConnected}
                setConnectionError={setConnectionError}
            />

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
                            <NotificationModal
                                t={t}
                                currentLanguage={currentLanguage}
                                isAdmin={isAdmin}
                                isConnected={isConnected}
                                connectionError={connectionError}
                                unreadCount={unreadCount}
                                unseenNotifications={unseenNotifications}
                                missedNotifications={missedNotifications}
                                allNotifications={allNotifications}
                                realtimeAlerts={realtimeAlerts}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                markAllAsSeenMutation={markAllAsSeenMutation}
                                markNotificationAsSeenMutation={markNotificationAsSeenMutation}
                                markAsDeliveredMutation={markAsDeliveredMutation}
                                updateEmergencyAlertStatusMutation={updateEmergencyAlertStatusMutation}
                                refetchUnreadCount={refetchUnreadCount}
                                refetchUnseen={refetchUnseen}
                                refetchMissed={refetchMissed}
                                refetchAll={refetchAll}
                                handleMarkAllAsSeen={handleMarkAllAsSeen}
                                handleMarkNotificationAsSeen={handleMarkNotificationAsSeen}
                                handleMarkAsDelivered={handleMarkAsDelivered}
                                handleEmergencyAlertStatus={handleEmergencyAlertStatus}
                            />
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

                        <LanguageDropdown
                            showLanguageDropdown={showLanguageDropdown}
                            isLoading={isLoading}
                            currentLanguage={currentLanguage}
                            currentLangName={currentLangName}
                            currentLangFlag={currentLangFlag}
                            t={t}
                            handleLanguageChange={handleLanguageChange}
                        />
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

                        <ProfileDropdown
                            showProfileDropdown={showProfileDropdown}
                            userName={userName}
                            userRole={userRole}
                            userEmail={user?.email}
                            t={t}
                            signOut={() => signOut({ redirect: false })}
                        />
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