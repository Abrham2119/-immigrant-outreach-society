'use client';

import { useMyProfile, useUpdateMyProfile } from '@/domain/users/use-users';

/**
 * A "dumb" UI component for displaying and editing the user's profile.
 *
 * Responsibilities:
 * 1. Rendering the UI based on the props it receives.
 * 2. Calling the mutation function when the user clicks "Save".
 * 3. Not knowing anything about where the data comes from or how it's fetched.
 */
export function UserProfileForm() {
  // 1. Use the custom hook to get the user's profile data and status.
  const { data: profile, isLoading, isError } = useMyProfile();

  // 2. Use the mutation hook to get a function to update the profile.
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile();

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (isError) {
    return <div>There was an error loading your profile.</div>;
  }

  // This would be a form with input fields bound to the profile data.
  // For simplicity, we are just displaying the data.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would get the new data from the form state.
    const updatedData = { firstName: 'Jane' };
    updateProfile(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          defaultValue={profile?.firstName}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          defaultValue={profile?.lastName}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isUpdating}
        className="rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
} 