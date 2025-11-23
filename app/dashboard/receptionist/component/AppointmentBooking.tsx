"use client";
import { useAvailableSlots, useBookAppointment } from "@/application/hooks/useAppointmentManagement";
import { Datepicker } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const createMountainTimeDate = (year?: number, month?: number, day?: number): Date => {
  if (year !== undefined && month !== undefined && day !== undefined) {
    return new Date(Date.UTC(year, month, day, 12, 0, 0));
  }
  const now = new Date();
  const mtOffset = -7;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * mtOffset));
};

const formatDateForMountainTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  isAvailable: boolean;
}

interface AppointmentBookingProps {
  clientId: string;
  personnelId: string;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  clientId,
  personnelId,
}) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(createMountainTimeDate());
  const [selectedTime, setSelectedTime] = useState<string>("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setDate(tomorrow.getDate() + 30);
  endDate.setHours(23, 59, 59, 999);

  const startDateStr = formatDateForMountainTime(tomorrow);
  const endDateStr = formatDateForMountainTime(endDate);

  const { data: availableSpots = [] } = useAvailableSlots(personnelId, startDateStr, endDateStr);
  const bookAppointmentMutation = useBookAppointment();


  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const availableTimeSlots: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];

    const dateString = formatDateForMountainTime(selectedDate);

    const spotsForDate = availableSpots.filter((spot: any) => {
      const spotDate = new Date(spot.date);
      const spotDateStr = formatDateForMountainTime(spotDate);
      return spotDateStr === dateString;
    });

    return spotsForDate.map((spot: any) => {
      return {
        id: `${spot.start}-${spot.end}`,
        label: formatTime(spot.start),
        start: spot.start,
        end: spot.end,
        isAvailable: true
      };
    });
  }, [selectedDate, availableSpots]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 1);
    setSelectedDate(newDate);
    setSelectedTime("");
  };

  const handleTimeChange = (slotId: string) => {
    const slot = availableTimeSlots.find(s => s.id === slotId);
    if (!slot || !slot.isAvailable) return;
    setSelectedTime(slotId);
  };

  const handleBookAppointment = () => {
    if (!selectedTime || !personnelId || !selectedDate) return;

    const selectedSlot = availableTimeSlots.find((slot) => slot.id === selectedTime);
    if (!selectedSlot) return;

    const appointmentData = {
      client: clientId,
      personnel: personnelId,
      date: formatDateForMountainTime(selectedDate),
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
    };

    bookAppointmentMutation.mutate(appointmentData, {
      onSuccess: (data) => {
        toast.success('Appointment booked successfully!');
        router.push("/dashboard/receptionist/booked-appointment");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || 'Error booking appointment';
        toast.error(errorMessage);
      }
    });
  };

  const formattedDate = formatDateForDisplay(selectedDate);
  const selectedSlot = availableTimeSlots.find((slot) => slot.id === selectedTime);

  return (
    <div className="pt-5 border-t border-gray-200 flex sm:flex-row flex-col sm:space-x-5 rtl:space-x-reverse">
      <div className="mx-auto sm:mx-0">
        <Datepicker
          value={selectedDate}
          onChange={handleDateChange}
          autoHide={true}
          inline={true}
          showClearButton={false}
          minDate={tomorrow}
          maxDate={endDate}
        />
      </div>

      <div className="sm:ms-7 sm:ps-5 sm:border-s border-gray-200 dark:border-gray-800 w-full sm:max-w-[20rem] mt-5 sm:mt-0">
        <h3 className="text-gray-900 dark:text-white text-base font-medium mb-3 text-center">
          {formattedDate}
        </h3>

        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {availableTimeSlots.filter((slot) => slot.isAvailable).length} slots available
        </div>

        {availableTimeSlots.length > 0 ? (
          <>
            <ul className="grid w-full grid-cols-2 gap-2 mt-3 mb-6">
              {availableTimeSlots.map((slot) => (
                <li key={slot.id}>
                  <input
                    type="radio"
                    id={slot.id}
                    name="timetable"
                    checked={selectedTime === slot.id}
                    onChange={() => handleTimeChange(slot.id)}
                    disabled={!slot.isAvailable}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={slot.id}
                    className={`inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center border rounded-lg cursor-pointer transition-all duration-200 ${slot.isAvailable
                      ? selectedTime === slot.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      : "text-gray-400 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                      }`}
                  >
                    {slot.label}
                  </label>
                </li>
              ))}
            </ul>

            {selectedTime && selectedSlot && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Appointment Summary</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <span className="font-medium">Date:</span> {formattedDate}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {formatTime(selectedSlot.start)} -{" "}
                    {formatTime(selectedSlot.end)}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> 1 hour
                  </p>
                  <p>
                    <span className="font-medium">Time Zone:</span> Mountain Time (Canada)
                  </p>
                </div>

                <button
                  onClick={handleBookAppointment}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-4 text-gray-500 dark:text-gray-400 p-4 bg-gray-50 rounded-lg">
            No available time slots for this date
          </div>
        )}
      </div>
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
    </div>
  );
};

export default AppointmentBooking;