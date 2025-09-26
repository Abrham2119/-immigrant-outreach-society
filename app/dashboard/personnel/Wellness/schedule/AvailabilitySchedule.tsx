"use client";
import React, { useState, useEffect } from "react";
import { useRuleManagement } from "@/domain/use-cases/rule";
import { Rule } from "@/domain/entities/appointment";
import { useSession } from "next-auth/react";

interface AvailabilityScheduleProps {
    existingRules?: Rule[];
}

const AvailabilitySchedule: React.FC<AvailabilityScheduleProps> = ({
    existingRules = [],
}) => {
    const { data: session } = useSession();
    const { createRuleMutation } = useRuleManagement();

    const personnelId = session?.user?.id || session?.user?.id;

    const daysOfWeek = [
        { id: 0, label: "Su", name: "Sunday" },
        { id: 1, label: "M", name: "Monday" },
        { id: 2, label: "T", name: "Tuesday" },
        { id: 3, label: "W", name: "Wednesday" },
        { id: 4, label: "Th", name: "Thursday" },
        { id: 5, label: "F", name: "Friday" },
        { id: 6, label: "Sa", name: "Saturday" },
    ];

    const [formData, setFormData] = useState({
        weekdays: [] as number[],
        startTime: "08:00",
        endTime: "11:00",
        endDate: "",
    });

    const [dayAvailability, setDayAvailability] = useState(
        daysOfWeek.reduce((acc, day) => {
            acc[day.id] = {
                selected: false,
                startTime: "08:00",
                endTime: "11:00",
            };
            return acc;
        }, {} as Record<number, { selected: boolean; startTime: string; endTime: string }>)
    );

    useEffect(() => {
        if (existingRules.length > 0) {
            const rule = existingRules[0];
            setFormData({
                weekdays: rule.weekdays,
                startTime: rule.startTime,
                endTime: rule.endTime,
                endDate: rule.endDate ? rule.endDate.split("T")[0] : "",
            });

            const updatedAvailability = { ...dayAvailability };
            daysOfWeek.forEach((day) => {
                updatedAvailability[day.id] = {
                    selected: rule.weekdays.includes(day.id),
                    startTime: rule.startTime,
                    endTime: rule.endTime,
                };
            });
            setDayAvailability(updatedAvailability);
        }
    }, [existingRules]);

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
    };

    const handleGlobalTimeChange = (
        field: "startTime" | "endTime",
        value: string
    ) => {
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
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTimeChange = (
        dayId: number,
        field: "startTime" | "endTime",
        value: string
    ) => {
        const updatedAvailability = {
            ...dayAvailability,
            [dayId]: {
                ...dayAvailability[dayId],
                [field]: value,
            },
        };

        setDayAvailability(updatedAvailability);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!personnelId) {
            console.error("No personnel ID found in session");
            return;
        }

        const rule: Rule = {
            personnel: personnelId,
            weekdays: formData.weekdays,
            startTime: formData.startTime,
            endTime: formData.endTime,
            endDate: formData.endDate ? `${formData.endDate}T00:00:00.000Z` : null,
        };

        createRuleMutation.mutate(rule);
    };

    if (!personnelId) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        Please log in to set your availability.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Weekly hours</h3>
                <p className="text-gray-600 mt-1 text-sm">
                    Please select time that you will be available to give service
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Global Time Settings */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">
                        Global Time Settings
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) =>
                                    handleGlobalTimeChange("startTime", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) =>
                                    handleGlobalTimeChange("endTime", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Availability Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                    Day
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                    Start Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                    End Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                    Available
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
    <span className={`bg-blue-700 w-7 h-7 flex items-center justify-center text-white rounded-full`}>
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
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
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
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
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

                {/* End Date */}
                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        End Date (optional)
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={formData.endDate}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                        }
                        className="w-full sm:w-1/2 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Timezone */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-gray-900 mb-2">Time zone</p>
                    <label className="flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-200 rounded"
                        />
                        <span className="ml-2">Mountain Time (Canada)</span>
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={
                            createRuleMutation.isPending || formData.weekdays.length === 0
                        }
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {createRuleMutation.isPending ? "Saving..." : "Save Availability"}
                    </button>
                </div>

                {/* Messages */}
                {createRuleMutation.isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                        Error saving availability: {createRuleMutation.error.message}
                    </div>
                )}

                {createRuleMutation.isSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                        Availability saved successfully!
                    </div>
                )}
            </form>
        </div>
    );
};

export default AvailabilitySchedule;