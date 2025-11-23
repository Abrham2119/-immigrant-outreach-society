"use client";

import { useTranslatedText } from "@/domain/translation/presentation/getTranslatedText";
import { Menu, X, Bell, Globe, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import router from "next/router";

interface TopbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export default function Topbar({ isOpen, toggleMenu }: TopbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [unreadCount, setUnReadCount] = useState(0);
  const translatedText = useTranslatedText();

  const { data: session } = useSession();

  const user = session?.user;
  const userRole = user?.role;
  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split('@')[0] || 'User';

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const closeModals = () => {
    setShowNotificationModal(false);
    setShowLanguageDropdown(false);
    setShowProfileDropdown(false);
  };

  // Sample languages data
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    // Add your language change logic here
    console.log('Changing language to:', languageCode);
    setShowLanguageDropdown(false);
  };

  const handleProfileAction = (action: string) => {
    // Add your profile action logic here
    console.log('Profile action:', action);
    setShowProfileDropdown(false);
  };


    const handleLogout = async () => {

    if (!session?.user?.accessToken) {
      console.error("No access token available");
      await signOut({ redirect: false });
      router.push('/');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.accessToken}`,
          },
        }
      );

      console.log("Logout API response:", response.data);
      await signOut({ redirect: false});
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
      // Check if the error is from Axios
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Status code:', error.response?.status);

        // If token is invalid, proceed with client-side signout anyway
        if (error.response?.status === 403 || error.response?.status === 401) {
          console.log("Proceeding with client-side logout despite API failure");
          await signOut({ redirect: false });
          router.push('/');
          return;
        }
      }

      alert('Logout failed. Please try again.');
    }
  };

  return (
    <>
      {showNotificationModal && (
        <div onClick={closeModals} className="fixed inset-0 z-40" />
      )}
      <div className="sticky top-section   top-0 z-50 w-full h-[65px] flex items-center justify-between bg-white border-b border-[#C4C4C4] px-3 md:px-6">
        <div className="flex items-center">
          <button
            className="md:hidden px-2 rounded-md bg-transparent"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Image src="/assets/canada.svg" alt="Immigration Logo" className="  w-auto h-14" width={100} height={100} />
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} className={isNewNotification ? "text-blue-600" : "text-gray-600"} />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}

            {/* Notification Dropdown */}
            {showNotificationModal && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-center">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Change language"
            >
              <Globe size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">EN</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="text-sm text-gray-700">{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User profile"
            >
              <Image src="/assets/pp.svg" alt="Immigration Logo" className="h-auto w-auto rounded-full bg-gray-200" width={100} height={100} />

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole || 'User'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500 capitalize">{userRole || 'User'}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => handleProfileAction('profile')}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => handleProfileAction('settings')}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  {/* <button
                    onClick={() => handleLogout}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showNotificationModal || showLanguageDropdown || showProfileDropdown) && (
        <div
          onClick={closeModals}
          className="fixed inset-0 z-40"
        />
      )}
    </>
  );
}