"use client";
import React from "react";
import { useRuleManagement } from "@/domain/use-cases/rule";
import { Rule } from "@/domain/entities/appointment";
import Link from "next/link";
import { toast } from "react-toastify";

interface RulesListProps {
    rules: Rule[];
}

const RulesList: React.FC<RulesListProps> = ({ rules }) => {
    const { deleteRuleMutation } = useRuleManagement();

    const daysOfWeek = [
        { id: 0, label: "Sun", name: "Sunday" },
        { id: 1, label: "Mon", name: "Monday" },
        { id: 2, label: "Tue", name: "Tuesday" },
        { id: 3, label: "Wed", name: "Wednesday" },
        { id: 4, label: "Thu", name: "Thursday" },
        { id: 5, label: "Fri", name: "Friday" },
        { id: 6, label: "Sat", name: "Saturday" },
    ];

    const formatTime = (time: string) => {
        if (!time) return "N/A";
        
        // Convert 24-hour format to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        
        return `${displayHour}:${minutes} ${period}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "No end date";
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
        if (window.confirm("Are you sure you want to delete this availability rule?")) {
            deleteRuleMutation.mutate(ruleId, {
                onSuccess: () => {
                    toast.success("Rule deleted successfully!");
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Error deleting rule");
                }
            });
        }
    };

    if (rules.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Availability Rules</h3>
                <div className="text-center py-8 text-gray-500">
                    <p>No availability rules set yet.</p>
                    <p className="text-sm mt-1">Create your first rule using the form on the left.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Availability Rules</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {rules.length} rule{rules.length !== 1 ? 's' : ''}
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
                                        {rule.weekdays.length} day{rule.weekdays.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">Time:</span> {formatTime(rule.startTime)} - {formatTime(rule.endTime)}
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">End Date:</span> {formatDate(rule.endDate)}
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                                {/* Edit Button */}
                                {/* <Link
                                    href={`/dashboard/personnel/Wellness/schedule/edit/${rule._id}`}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit rule"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Link> */}
                                
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteRule(rule._id!)}
                                    disabled={deleteRuleMutation.isPending}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                    title="Delete rule"
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
                    Error deleting rule: {deleteRuleMutation.error.message}
                </div>
            )}
        </div>
    );
};

export default RulesList;