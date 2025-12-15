"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import EditRuleForm from '../../components/EditRuleForm';
import { useTranslation } from '@/components/providers/translation.provider';

const EditRulePage = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const ruleId = params.id as string;
  const { t } = useTranslation();

  if (status === 'loading') {
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
            {t('authentication_required', 'Authentication Required')}
          </h1>
          <p className="text-gray-600">
            {t('login_to_edit_availability_rules', 'Please log in to edit availability rules.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditRuleForm ruleId={ruleId} />
      </div>
    </div>
  );
};

export default EditRulePage;