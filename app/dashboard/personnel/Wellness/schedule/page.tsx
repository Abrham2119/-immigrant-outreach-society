"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import AvailabilitySchedule from './components/AvailabilitySchedule';
import { getRulesUseCase } from '@/infrastructure/api/appointmentService';
import RulesList from './components/RulesList';
import { useTranslation } from '@/components/providers/translation.provider';

const AvailabilityPage = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  
  const { data: existingRules, isLoading } = useQuery({
    queryKey: ['rules', session?.user?.id],
    queryFn: () => getRulesUseCase(session?.user?.id),
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('authenticationRequiredTitle', 'Authentication Required')}
          </h1>
          <p className="text-gray-600">
            {t('pleaseLoginToAccess', 'Please log in to access this page.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create/Update Rule Form */}
          <div>
            <AvailabilitySchedule existingRules={existingRules || []} />
          </div>
          
          {/* Rules List */}
          <div>
            <RulesList rules={existingRules || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;