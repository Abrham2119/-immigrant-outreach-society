import { User } from "lucide-react";

interface ProfileDropdownProps {
  showProfileDropdown: boolean;
  userName: string;
  userRole?: string;
  userEmail?: string;
  t: (key: string, fallback: string) => string;
  signOut: () => void;
}

export const ProfileDropdown = ({
  showProfileDropdown,
  userName,
  userRole,
  userEmail,
  t,
  signOut
}: ProfileDropdownProps) => {
  if (!showProfileDropdown) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <p className="font-medium text-gray-800">{userName}</p>
        <p className="text-sm text-gray-500 capitalize">{userRole || t('user', 'User')}</p>
        <p className="text-sm text-gray-600 truncate">{userEmail}</p>
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
          onClick={signOut}
          className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors text-sm text-red-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('logout', 'Logout')}
        </button>
      </div>
    </div>
  );
};