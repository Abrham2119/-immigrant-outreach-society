"use client";
import { useTranslation } from '@/components/providers/translation.provider';
import { Rule } from "@/domain/entities/appointment";
import { useRuleManagement } from "@/domain/use-cases/rule";
import React from "react";
import { toast } from "react-toastify";

interface RulesListProps {
    rules: Rule[];
}

const RulesList: React.FC<RulesListProps> = ({ rules }) => {
    const { deleteRuleMutation } = useRuleManagement();
    const { t } = useTranslation();

    const daysOfWeek = [
        { id: 0, label: t('sunAbbreviation', "Sun"), name: t('sunday', "Sunday") },
        { id: 1, label: t('monAbbreviation', "Mon"), name: t('monday', "Monday") },
        { id: 2, label: t('tueAbbreviation', "Tue"), name: t('tuesday', "Tuesday") },
        { id: 3, label: t('wedAbbreviation', "Wed"), name: t('wednesday', "Wednesday") },
        { id: 4, label: t('thuAbbreviation', "Thu"), name: t('thursday', "Thursday") },
        { id: 5, label: t('friAbbreviation', "Fri"), name: t('friday', "Friday") },
        { id: 6, label: t('satAbbreviation', "Sat"), name: t('saturday', "Saturday") },
    ];

    const formatTime = (time: string) => {
        if (!time) return t('notAvailableAbbreviation', "N/A");
        
        // Convert 24-hour format to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? t('pm', "PM") : t('am', "AM");
        const displayHour = hour % 12 || 12;
        
        return `${displayHour}:${minutes} ${period}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return t('noEndDate', "No end date");
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDayLabels = (weekdays: number[]) => {
        return weekdays.map(dayId => {
            const day = daysOfWeek.find(d => d.id === dayId);
            return day?.label || dayId;
        }).join(', ');
    };

    const handleDeleteRule = (ruleId: string) => {
        if (window.confirm(t('confirmDeleteRule', "Are you sure you want to delete this availability rule?"))) {
            deleteRuleMutation.mutate(ruleId, {
                onSuccess: () => {
                    toast.success(t('ruleDeletedSuccessfully', "Rule deleted successfully!"));
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || t('errorDeletingRule', "Error deleting rule"));
                }
            });
        }
    };

    if (rules.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('yourAvailabilityRules', "Your Availability Rules")}
                </h3>
                <div className="text-center py-8 text-gray-500">
                    <p>{t('noAvailabilityRulesSetYet', "No availability rules set yet.")}</p>
                    <p className="text-sm mt-1">
                        {t('createFirstRuleUsingForm', "Create your first rule using the form on the left.")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    {t('yourAvailabilityRules', "Your Availability Rules")}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {rules.length} {t('rule', "rule")}{rules.length !== 1 ? t('pluralSuffix', "s") : ''}
                </span>
            </div>

            <div className="space-y-4">
                {rules.map((rule) => (
                    <div
                        key={rule._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        {getDayLabels(rule.weekdays)}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                                        {rule.weekdays.length} {t('day', "day")}{rule.weekdays.length !== 1 ? t('pluralSuffix', "s") : ''}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">{t('time', "Time")}:</span> {formatTime(rule.startTime)} - {formatTime(rule.endTime)}
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">{t('endDate', "End Date")}:</span> {formatDate(rule.endDate)}
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                                <button
                                    onClick={() => handleDeleteRule(rule._id!)}
                                    disabled={deleteRuleMutation.isPending}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                    title={t('deleteRule', "Delete rule")}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Error Message */}
            {deleteRuleMutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                    {t('errorDeletingRuleMessage', "Error deleting rule")}: {deleteRuleMutation.error.message}
                </div>
            )}
        </div>
    );
};

export default RulesList;