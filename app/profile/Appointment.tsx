"use client"
import React, { useState, useMemo } from "react";
import { Datepicker } from "flowbite-react";

interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  isAvailable: boolean;
}

interface AvailableSpot {
  date: string;
  start: string;
  end: string;
  personnel: string;
}

type AppointmentProps = {
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: { id: string; label: string; start: string; end: string }) => void;
};

// Dummy data matching your backend format
const DUMMY_AVAILABLE_SPOTS: AvailableSpot[] = [
  {
    "date": "2025-09-27T00:00:00.000Z",
    "start": "09:00",
    "end": "10:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-27T00:00:00.000Z",
    "start": "10:00",
    "end": "11:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-27T00:00:00.000Z",
    "start": "11:00",
    "end": "12:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-28T00:00:00.000Z",
    "start": "09:00",
    "end": "10:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-28T00:00:00.000Z",
    "start": "10:00",
    "end": "11:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-28T00:00:00.000Z",
    "start": "11:00",
    "end": "12:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-29T00:00:00.000Z",
    "start": "14:00",
    "end": "15:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  },
  {
    "date": "2025-09-29T00:00:00.000Z",
    "start": "15:00",
    "end": "16:00",
    "personnel": "6510f2c6c1234a9b2f8e1a55"
  }
];

const Appointment: React.FC<AppointmentProps> = ({ onDateSelect, onTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-09-27"));
  const [selectedTime, setSelectedTime] = useState<string>("");

  // All possible time slots
  const allTimeSlots: Omit<TimeSlot, 'isAvailable'>[] = [
    { id: "09:00-10:00", label: "09:00 AM", start: "09:00", end: "10:00" },
    { id: "10:00-11:00", label: "10:00 AM", start: "10:00", end: "11:00" },
    { id: "11:00-12:00", label: "11:00 AM", start: "11:00", end: "12:00" },
    { id: "12:00-13:00", label: "12:00 PM", start: "12:00", end: "13:00" },
    { id: "13:00-14:00", label: "01:00 PM", start: "13:00", end: "14:00" },
    { id: "14:00-15:00", label: "02:00 PM", start: "14:00", end: "15:00" },
    { id: "15:00-16:00", label: "03:00 PM", start: "15:00", end: "16:00" },
    { id: "16:00-17:00", label: "04:00 PM", start: "16:00", end: "17:00" },
  ];

  // Get available time slots for selected date
  const availableTimeSlots = useMemo((): TimeSlot[] => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    return allTimeSlots.map(slot => {
      const isAvailable = DUMMY_AVAILABLE_SPOTS.some(spot => 
        spot.date.includes(dateString) && 
        spot.start === slot.start && 
        spot.end === slot.end
      );
      
      return {
        ...slot,
        isAvailable
      };
    });
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(""); // Reset time selection when date changes
    onDateSelect?.(date);
  };

  const handleTimeChange = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    
    setSelectedTime(slot.id);
    onTimeSelect?.({
      id: slot.id,
      label: slot.label,
      start: slot.start,
      end: slot.end
    });
  };

  // Format date for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="pt-5 border-t border-gray-200 dark:border-gray-800 flex sm:flex-row flex-col sm:space-x-5 rtl:space-x-reverse">
      {/* Flowbite Datepicker */}
      <div className="mx-auto sm:mx-0">
        <Datepicker
          value={selectedDate}
          onChange={handleDateChange}
          autoHide={true}
          inline={true}
          showClearButton={false}
          minDate={new Date("2025-09-27")}
          maxDate={new Date("2025-09-30")}
        />
      </div>

      {/* Time Slots */}
      <div className="sm:ms-7 sm:ps-5 sm:border-s border-gray-200 dark:border-gray-800 w-full sm:max-w-[15rem] mt-5 sm:mt-0">
        <h3 className="text-gray-900 dark:text-white text-base font-medium mb-3 text-center">
          {formattedDate}
        </h3>

        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {availableTimeSlots.filter(slot => slot.isAvailable).length} slots available
        </div>

        <ul className="grid w-full grid-cols-2 gap-2 mt-3">
          {availableTimeSlots.map((slot) => (
            <li key={slot.id}>
              <input
                type="radio"
                id={slot.id}
                name="timetable"
                checked={selectedTime === slot.id}
                onChange={() => handleTimeChange(slot)}
                disabled={!slot.isAvailable}
                className="hidden peer"
              />
              <label
                htmlFor={slot.id}
                className={`inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center border rounded-lg cursor-pointer transition-all duration-200 ${
                  slot.isAvailable
                    ? selectedTime === slot.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    : "text-gray-400 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                }`}
              >
                {slot.label}
                {!slot.isAvailable && (
                  <span className="ml-1 text-xs">(Unavailable)</span>
                )}
              </label>
            </li>
          ))}
        </ul>

        {availableTimeSlots.filter(slot => slot.isAvailable).length === 0 && (
          <div className="text-center mt-4 text-gray-500 dark:text-gray-400">
            No available time slots for this date
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;