"use client";
import React, { useState, useEffect } from "react";
import { useRuleManagement } from "@/domain/use-cases/rule";
import { Rule } from "@/domain/entities/appointment";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "@/components/providers/translation.provider";

interface AvailabilityScheduleProps {
    existingRules?: Rule[];
}

const AvailabilitySchedule: React.FC<AvailabilityScheduleProps> = ({
    existingRules = [],
}) => {
    const { data: session } = useSession();
    const { createRuleMutation } = useRuleManagement();
    const { t } = useTranslation(); // Added hook

    const personnelId = session?.user?.id;

    const daysOfWeek = [
        { id: 1, label: "M", name: "Monday" },
        { id: 2, label: "T", name: "Tuesday" },
        { id: 3, label: "W", name: "Wednesday" },
        { id: 4, label: "Th", name: "Thursday" },
        { id: 5, label: "F", name: "Friday" },
        { id: 6, label: "Sa", name: "Saturday" },
    ];

    // Helper function to convert time to 24-hour format
    const formatTimeTo24Hour = (time: string): string => {
        if (!time) return "08:00";
        
        // If already in 24-hour format
        if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            return time;
        }
        
        // If in 12-hour format with AM/PM
        const [timePart, period] = time.split(/(?=[AP]M)/i);
        const [hours, minutes] = timePart.split(':');
        
        let hour = parseInt(hours);
        if (period?.toUpperCase() === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period?.toUpperCase() === 'AM' && hour === 12) {
            hour = 0;
        }
        
        return `${hour.toString().padStart(2, '0')}:${minutes || '00'}`;
    };

    // Validation function to check if start time is before end time
    const validateTimeRange = (startTime: string, endTime: string): boolean => {
        try {
            const start = new Date(`1970-01-01T${startTime}:00`);
            const end = new Date(`1970-01-01T${endTime}:00`);
            return start < end;
        } catch {
            return false;
        }
    };

    // Validation function to check if time is within 8:00 AM to 6:00 PM
    const validateTimeWithinBounds = (time: string): boolean => {
        try {
            const timeDate = new Date(`1970-01-01T${time}:00`);
            const minTime = new Date(`1970-01-01T08:00:00`);
            const maxTime = new Date(`1970-01-01T18:00:00`);
            return timeDate >= minTime && timeDate <= maxTime;
        } catch {
            return false;
        }
    };

    const [formData, setFormData] = useState({
        weekdays: [] as number[],
        startTime: "08:00",
        endTime: "17:00",
        endDate: "",
    });

    const [dayAvailability, setDayAvailability] = useState(
        daysOfWeek.reduce((acc, day) => {
            acc[day.id] = {
                selected: false,
                startTime: "08:00",
                endTime: "17:00",
            };
            return acc;
        }, {} as Record<number, { selected: boolean; startTime: string; endTime: string }>)
    );

    const [errors, setErrors] = useState<{
        global?: string;
        days?: Record<number, string>;
        submit?: string;
    }>({});

    useEffect(() => {
        if (createRuleMutation.isSuccess) {
            toast.success(t('availabilitySavedSuccessfully', "Availability saved successfully!"), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

        if (createRuleMutation.isError) {
            // Type-safe error message extraction
            const error = createRuleMutation.error as any;
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               t('errorSavingAvailability', "Error saving availability");
            
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [createRuleMutation.isSuccess, createRuleMutation.isError, createRuleMutation.error]);

    useEffect(() => {
        if (existingRules.length > 0) {
            const rule = existingRules[0];
            const formattedStartTime = formatTimeTo24Hour(rule.startTime);
            const formattedEndTime = formatTimeTo24Hour(rule.endTime);
            
            setFormData({
                weekdays: rule.weekdays,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                endDate: rule.endDate ? rule.endDate.split("T")[0] : "",
            });

            const updatedAvailability = { ...dayAvailability };
            daysOfWeek.forEach((day) => {
                updatedAvailability[day.id] = {
                    selected: rule.weekdays.includes(day.id),
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                };
            });
            setDayAvailability(updatedAvailability);
        }
    }, [existingRules]);

    const validateAllTimes = (): boolean => {
        const newErrors: { global?: string; days?: Record<number, string> } = {};
        const dayErrors: Record<number, string> = {};

        // Validate global time range
        if (!validateTimeRange(formData.startTime, formData.endTime)) {
            newErrors.global = t('startTimeMustBeBeforeEndTime', "Start time must be before end time");
        }

        // Validate global time bounds
        if (!validateTimeWithinBounds(formData.startTime)) {
            newErrors.global = t('startTimeMustBeBetween8am6pm', "Start time must be between 8:00 AM and 6:00 PM");
        } else if (!validateTimeWithinBounds(formData.endTime)) {
            newErrors.global = t('endTimeMustBeBetween8am6pm', "End time must be between 8:00 AM and 6:00 PM");
        }

        // Validate individual day time ranges and bounds
        Object.entries(dayAvailability).forEach(([dayId, availability]) => {
            const dayNum = parseInt(dayId);
            if (availability.selected) {
                if (!validateTimeRange(availability.startTime, availability.endTime)) {
                    dayErrors[dayNum] = t('startTimeMustBeBeforeEndTime', "Start time must be before end time");
                } else if (!validateTimeWithinBounds(availability.startTime)) {
                    dayErrors[dayNum] = t('startTimeMustBeBetween8am6pm', "Start time must be between 8:00 AM and 6:00 PM");
                } else if (!validateTimeWithinBounds(availability.endTime)) {
                    dayErrors[dayNum] = t('endTimeMustBeBetween8am6pm', "End time must be between 8:00 AM and 6:00 PM");
                }
            }
        });

        if (Object.keys(dayErrors).length > 0) {
            newErrors.days = dayErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearErrors = () => {
        setErrors({});
    };

    const handleDaySelectionChange = (dayId: number, selected: boolean) => {
        const updatedAvailability = {
            ...dayAvailability,
            [dayId]: {
                ...dayAvailability[dayId],
                selected,
            },
        };

        setDayAvailability(updatedAvailability);

        const selectedDays = Object.entries(updatedAvailability)
            .filter(([_, value]) => value.selected)
            .map(([key]) => parseInt(key));

        setFormData((prev) => ({
            ...prev,
            weekdays: selectedDays,
        }));

        clearErrors();
    };

    const handleGlobalTimeChange = (
        field: "startTime" | "endTime",
        value: string
    ) => {
        const updatedFormData = {
            ...formData,
            [field]: value,
        };

        // Validate the new time range and bounds
        const startTime = field === "startTime" ? value : formData.startTime;
        const endTime = field === "endTime" ? value : formData.endTime;

        if (!validateTimeRange(startTime, endTime)) {
            setErrors(prev => ({
                ...prev,
                global: t('startTimeMustBeBeforeEndTime', "Start time must be before end time")
            }));
        } else if (!validateTimeWithinBounds(startTime)) {
            setErrors(prev => ({
                ...prev,
                global: t('startTimeMustBeBetween8am6pm', "Start time must be between 8:00 AM and 6:00 PM")
            }));
        } else if (!validateTimeWithinBounds(endTime)) {
            setErrors(prev => ({
                ...prev,
                global: t('endTimeMustBeBetween8am6pm', "End time must be between 8:00 AM and 6:00 PM")
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                global: undefined
            }));
        }

        setFormData(updatedFormData);

        // Update all selected days with the new global time
        const updatedAvailability = { ...dayAvailability };
        Object.keys(updatedAvailability).forEach((dayId) => {
            const dayNum = parseInt(dayId);
            if (updatedAvailability[dayNum].selected) {
                updatedAvailability[dayNum] = {
                    ...updatedAvailability[dayNum],
                    [field]: value,
                };
            }
        });

        setDayAvailability(updatedAvailability);
    };

    const handleTimeChange = (
        dayId: number,
        field: "startTime" | "endTime",
        value: string
    ) => {
        const currentDay = dayAvailability[dayId];
        const newStartTime = field === "startTime" ? value : currentDay.startTime;
        const newEndTime = field === "endTime" ? value : currentDay.endTime;

        // Validate the individual day time range and bounds
        if (currentDay.selected) {
            if (!validateTimeRange(newStartTime, newEndTime)) {
                setErrors(prev => {
                    const updatedDays = { ...prev.days };
                    updatedDays[dayId] = t('startTimeMustBeBeforeEndTime', "Start time must be before end time");
                    return {
                        ...prev,
                        days: updatedDays
                    };
                });
            } else if (!validateTimeWithinBounds(newStartTime)) {
                setErrors(prev => {
                    const updatedDays = { ...prev.days };
                    updatedDays[dayId] = t('startTimeMustBeBetween8am6pm', "Start time must be between 8:00 AM and 6:00 PM");
                    return {
                        ...prev,
                        days: updatedDays
                    };
                });
            } else if (!validateTimeWithinBounds(newEndTime)) {
                setErrors(prev => {
                    const updatedDays = { ...prev.days };
                    updatedDays[dayId] = t('endTimeMustBeBetween8am6pm', "End time must be between 8:00 AM and 6:00 PM");
                    return {
                        ...prev,
                        days: updatedDays
                    };
                });
            } else {
                setErrors(prev => {
                    const updatedDays = { ...prev.days };
                    delete updatedDays[dayId];
                    return {
                        ...prev,
                        days: Object.keys(updatedDays).length > 0 ? updatedDays : undefined
                    };
                });
            }
        }

        const updatedAvailability = {
            ...dayAvailability,
            [dayId]: {
                ...currentDay,
                [field]: value,
            },
        };

        setDayAvailability(updatedAvailability);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!personnelId) {
            toast.error(t('pleaseLoginToSetAvailability', "Please log in to set your availability."), {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        // Validate all times before submission
        if (!validateAllTimes()) {
            toast.error(t('fixValidationErrorsBeforeSubmitting', "Please fix the validation errors before submitting."), {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        // Ensure at least one day is selected
        if (formData.weekdays.length === 0) {
            toast.error(t('pleaseSelectAtLeastOneDay', "Please select at least one day."), {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        // Clear any previous submit errors
        setErrors(prev => ({ ...prev, submit: undefined }));

        const rule: Rule = {
            personnel: personnelId,
            weekdays: formData.weekdays,
            startTime: formData.startTime,
            endTime: formData.endTime,
            endDate: formData.endDate ? `${formData.endDate}T00:00:00.000Z` : null,
        };

        createRuleMutation.mutate(rule);
    };

    const hasErrors = !!errors.global || (errors.days && Object.keys(errors.days).length > 0);

    if (!personnelId) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        {t('pleaseLoginToSetAvailability', "Please log in to set your availability.")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t('weeklyWorkingHours', "Weekly Working hours")}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                        {t('selectTimeAvailableForService', "Please select time that you will be available to give service")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Global Time Settings */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">
                            {t('globalTimeSettings8am6pm', "Global Time Settings (8:00 AM - 6:00 PM)")}
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('startTime', "Start Time")}
                                </label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) =>
                                        handleGlobalTimeChange("startTime", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.global ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    step="300"
                                    min="08:00"
                                    max="18:00"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('endTime', "End Time")}
                                </label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) =>
                                        handleGlobalTimeChange("endTime", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.global ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    step="300"
                                    min="08:00"
                                    max="18:00"
                                />
                            </div>
                        </div>
                        {errors.global && (
                            <p className="text-red-600 text-xs mt-2">{errors.global}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                            {t('timesMustBeBetween8am6pm', "Times must be between 8:00 AM and 6:00 PM (08:00 - 18:00)")}
                        </p>
                    </div>

                    {/* Availability Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                        {t('day', "Day")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                        {t('startTime', "Start Time")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                        {t('endTime', "End Time")}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                        {t('available', "Available")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {daysOfWeek.map((day) => (
                                    <tr
                                        key={day.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                                            <span className="bg-blue-700 w-7 h-7 flex items-center justify-center text-white rounded-full">
                                                {day.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="time"
                                                value={dayAvailability[day.id].startTime}
                                                onChange={(e) =>
                                                    handleTimeChange(day.id, "startTime", e.target.value)
                                                }
                                                disabled={!dayAvailability[day.id].selected}
                                                className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 ${
                                                    errors.days?.[day.id] ? 'border-red-300' : 'border-gray-200'
                                                }`}
                                                step="300"
                                                min="08:00"
                                                max="18:00"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="time"
                                                value={dayAvailability[day.id].endTime}
                                                onChange={(e) =>
                                                    handleTimeChange(day.id, "endTime", e.target.value)
                                                }
                                                disabled={!dayAvailability[day.id].selected}
                                                className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 ${
                                                    errors.days?.[day.id] ? 'border-red-300' : 'border-gray-200'
                                                }`}
                                                step="300"
                                                min="08:00"
                                                max="18:00"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center items-center">
                                            <input
                                                type="checkbox"
                                                checked={dayAvailability[day.id].selected}
                                                onChange={(e) =>
                                                    handleDaySelectionChange(day.id, e.target.checked)
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-200 rounded"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Display individual day errors */}
                    {errors.days && Object.keys(errors.days).length > 0 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-800 text-sm font-medium mb-2">
                                {t('timeRangeErrors', "Time range errors:")}
                            </p>
                            <ul className="text-red-700 text-sm list-disc list-inside">
                                {Object.entries(errors.days).map(([dayId, error]) => {
                                    if (error) {
                                        const day = daysOfWeek.find(d => d.id === parseInt(dayId));
                                        return (
                                            <li key={dayId}>
                                                {day?.name}: {error}
                                            </li>
                                        );
                                    }
                                    return null;
                                }).filter(Boolean)}
                            </ul>
                        </div>
                    )}

                    {/* End Date */}
                    <div>
                        <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            {t('endDateOptional', "End Date (optional)")}
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={formData.endDate}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                            }
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full sm:w-1/2 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Timezone */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-medium text-gray-900 mb-2">
                            {t('timeZone', "Time zone")}
                        </p>
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked
                                readOnly
                                className="h-4 w-4 text-blue-600 border-gray-200 rounded"
                            />
                            <span className="ml-2">
                                {t('mountainTimeCanada', "Mountain Time (Canada)")}
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={
                                createRuleMutation.isPending || 
                                formData.weekdays.length === 0 ||
                                hasErrors
                            }
                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {createRuleMutation.isPending ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('saving', "Saving...")}
                                </div>
                            ) : t('saveAvailability', "Save Availability")}
                        </button>
                    </div>
                </form>
            </div>

            {/* React Toastify Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default AvailabilitySchedule;