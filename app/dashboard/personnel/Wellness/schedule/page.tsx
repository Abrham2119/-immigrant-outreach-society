"use client"
// pages/availability.tsx or components/AvailabilityPage.tsx
import React from 'react';
import { useSession } from 'next-auth/react';
import { getRulesUseCase } from '@/infrastructure/api/appointmentService';
import { useQuery } from '@tanstack/react-query';
import AvailabilitySchedule from './AvailabilitySchedule';

const AvailabilityPage = () => {
  const { data: session, status } = useSession();
  
  // Fetch existing rules for this personnel
  const { data: existingRules, isLoading } = useQuery({
    queryKey: ['rules', session?.user?.id],
    queryFn: () => getRulesUseCase(),
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
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="   py-8">
      <div className="max-w-2xl flex items-start justify-start ">
               
        <AvailabilitySchedule existingRules={existingRules || []} />
      </div>
    </div>
  );
};

export default AvailabilityPage;