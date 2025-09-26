"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getExceptionsUseCase } from '@/infrastructure/api/appointmentService';
import HolidayExceptions from './HolidayExceptions';

const HolidayExceptionsPage = () => {
  const { data: session, status } = useSession();
  
  // Fetch existing exceptions for this personnel
  const { data: existingExceptions, isLoading } = useQuery({
    queryKey: ['exceptions', session?.user?.id],
    queryFn: () => getExceptionsUseCase(session?.user?.id),
    enabled: !!session?.user?.id
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to manage holiday exceptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="   bg-gray-50 py-8">
      <div className="max-w-2xl flex items-start flex-col justify-start">
        <HolidayExceptions existingExceptions={existingExceptions || []} />
      </div>
    </div>
  );
};

export default HolidayExceptionsPage;