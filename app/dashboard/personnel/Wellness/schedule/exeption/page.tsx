"use client";
import React, { useState } from "react";
import { useRuleManagement } from "@/domain/use-cases/rule";
import { Exception } from "@/domain/entities/appointment";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface HolidayExceptionsProps {
    existingExceptions?: Exception[];
}

const HolidayExceptions: React.FC<HolidayExceptionsProps> = ({
    existingExceptions = [],
}) => {
    const { data: session } = useSession();
    const { createExceptionMutation, deleteExceptionMutation, useExceptions } = useRuleManagement();
    
    const personnelId = session?.user?.id || session?.user?.id;

    // Fetch exceptions
    const { data: exceptions = [] } = useExceptions(personnelId);

    const exceptionTypes = [
        { value: "holiday", label: "Holiday" },
        { value: "leave", label: "Leave" },
    ];

    const [formData, setFormData] = useState({
        date: "",
        type: "holiday" as Exception['type'],
        reason: "",
        startTime: "09:00",
        endTime: "17:00"
    });

    const [errors, setErrors] = useState<{ date?: string; reason?: string }>({});

    const validateForm = () => {
        const newErrors: { date?: string; reason?: string } = {};

        if (!formData.date) {
            newErrors.date = "Date is required";
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = "Cannot add exceptions for past dates";
            }
        }

        if (!formData.reason.trim()) {
            newErrors.reason = "Reason is required";
        } else if (formData.reason.trim().length < 3) {
            newErrors.reason = "Reason must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !personnelId) {
            return;
        }

        const exception: Exception = {
            personnel: personnelId,
            date: formData.date,
            type: formData.type,
            reason: formData.reason.trim(),
            startTime: formData.type === "holiday" ? undefined : formData.startTime,
            endTime: formData.type === "holiday" ? undefined : formData.endTime
        };

        createExceptionMutation.mutate(exception, {
            onSuccess: () => {
                setFormData({
                    date: "",
                    type: "holiday",
                    reason: "",
                    startTime: "09:00",
                    endTime: "17:00"
                });
                setErrors({});
                toast.success("Exception added successfully!");
            },
            onError: (error: Error) => {
                toast.error(`Error adding exception: ${error.message}`);
            }
        });
    };

    const handleDeleteException = (exceptionId: string) => {
        if (window.confirm("Are you sure you want to delete this exception?")) {
            deleteExceptionMutation.mutate(exceptionId, {
                onSuccess: () => {
                    toast.success("Exception deleted successfully!");
                },
                onError: (error: Error) => {
                    toast.error(`Error deleting exception: ${error.message}`);
                }
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleTypeChange = (type: Exception['type']) => {
        setFormData(prev => ({ 
            ...prev, 
            type,
            // Reset times when switching to holiday
            startTime: type === "holiday" ? "" : prev.startTime || "09:00",
            endTime: type === "holiday" ? "" : prev.endTime || "17:00"
        }));
    };

    if (!personnelId) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        Please log in to manage holiday exceptions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Holiday & Exemptions</h3>
                <p className="text-gray-600 mt-1 text-sm">
                    Add days when you will not be available for appointments
                </p>
            </div>

            {/* Add Exception Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.date ? 'border-red-300' : 'border-gray-200'
                            }`}
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                        )}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleTypeChange(e.target.value as Exception['type'])}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {exceptionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Time - Only show for non-holiday types */}
                    {formData.type !== "holiday" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* End Time - Only show for non-holiday types */}
                    {formData.type !== "holiday" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Reason */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason *
                        </label>
                        <input
                            type="text"
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder={
                                formData.type === "holiday" 
                                    ? "e.g., National Holiday, Christmas, etc."
                                    : formData.type === "leave"
                                    ? "e.g., Personal Time Off, Vacation, etc."
                                    : "e.g., Training, Meeting, etc."
                            }
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.reason ? 'border-red-300' : 'border-gray-200'
                            }`}
                        />
                        {errors.reason && (
                            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={createExceptionMutation.isPending}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {createExceptionMutation.isPending ? "Adding..." : "Add Exception"}
                    </button>
                </div>
            </form>

            {/* Existing Exceptions List */}
            <div>
                <h4 className="font-medium text-gray-900 mb-4 text-lg">Scheduled Exemptions</h4>
                
                {exceptions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No exceptions scheduled yet.</p>
                        <p className="text-sm mt-1">Add exceptions above to block appointment dates.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {exceptions.map((exception: any) => (
                            <div
                                key={exception._id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-3 h-3 rounded-full ${
                                        exception.type === 'holiday' ? 'bg-red-500' :
                                        exception.type === 'leave' ? 'bg-blue-500' :
                                        'bg-orange-500'
                                    }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(exception.date)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {exception.reason} • 
                                            <span className="capitalize"> {exception.type}</span>
                                            {exception.type !== "holiday" && exception.startTime && exception.endTime && (
                                                <span> • {exception.startTime} - {exception.endTime}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handleDeleteException(exception._id!)}
                                    disabled={deleteExceptionMutation.isPending}
                                    className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {deleteExceptionMutation.isPending ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HolidayExceptions;