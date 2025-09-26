"use client";
import { useAppointmentManagement } from "@/domain/use-cases/appointment";
import { Datepicker } from "flowbite-react";
import React, { useMemo, useState } from "react";

interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  isAvailable: boolean;
}

interface AppointmentBookingProps {
  onBookingSuccess?: (appointment: any) => void;
 clientId: string;
  personnelId: string;
}

interface AppointmentPageProps {
 
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  onBookingSuccess,
  clientId, 
  personnelId 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-09-27"));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const {
    useAvailableSlots,
    useExceptions,
    useBookedAppointments,
    bookAppointmentMutation
  } = useAppointmentManagement();

  // Calculate date range for API calls (current date to 30 days ahead)
  const startDate = new Date("2025-09-27").toISOString().split('T')[0];
  const endDate = new Date("2025-10-27").toISOString().split('T')[0];

  // Fetch data
  const { data: availableSpots = [] } = useAvailableSlots(personnelId, startDate, endDate);
  const { data: exceptions = [] } = useExceptions();
  const { data: bookedAppointments = [] } = useBookedAppointments();

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

  // Check if a date has exceptions (holidays or blocked)
  const isDateException = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return exceptions.some(exception =>
      exception.date.includes(dateString) &&
      (exception.type === 'holiday' || exception.type === 'personal' || exception.type === 'emergency')
    );
  };

  // Check if a specific time slot is booked
  const isTimeSlotBooked = (date: Date, startTime: string, endTime: string): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return bookedAppointments.some(appointment =>
      appointment.date.includes(dateString) &&
      appointment.startTime === startTime &&
      appointment.endTime === endTime
    );
  };

  // Check if a specific time slot is available
  const isTimeSlotAvailable = (date: Date, startTime: string, endTime: string): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return availableSpots.some(spot =>
      spot.date.includes(dateString) &&
      spot.start === startTime &&
      spot.end === endTime
    );
  };

  // Get available time slots for selected date
  const availableTimeSlots = useMemo((): TimeSlot[] => {
    if (isDateException(selectedDate)) {
      return allTimeSlots.map(slot => ({
        ...slot,
        isAvailable: false
      }));
    }

    return allTimeSlots.map(slot => {
      const isBooked = isTimeSlotBooked(selectedDate, slot.start, slot.end);
      const isAvailable = !isBooked && isTimeSlotAvailable(selectedDate, slot.start, slot.end);

      return {
        ...slot,
        isAvailable
      };
    });
  }, [selectedDate, availableSpots, exceptions, bookedAppointments]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeChange = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    setSelectedTime(slot.id);
  };

  const handleBookAppointment = () => {
    if (!selectedTime || !personnelId) return;

    const selectedSlot = availableTimeSlots.find(slot => slot.id === selectedTime);
    if (!selectedSlot) return;

    const appointmentData = {
      client: clientId,
      personnel: personnelId,
      date: selectedDate.toISOString().split('T')[0],
      startTime: selectedSlot.start,
      endTime: selectedSlot.end
    };

    bookAppointmentMutation.mutate(appointmentData, {
      onSuccess: (data) => {
        setBookingConfirmed(true);
        onBookingSuccess?.(data.populatedAppointment);
      }
    });
  };

  // Format date for display in Canada timezone
  const formattedDate = selectedDate.toLocaleDateString('en-CA', {
    timeZone: 'America/Toronto',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get selected time slot details
  const selectedSlot = availableTimeSlots.find(slot => slot.id === selectedTime);

  // Format time for display in Canada timezone
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Custom datepicker function to disable exception dates
  const isDateDisabled = (date: Date) => {
    return isDateException(date) || date < new Date("2025-09-27") || date > new Date("2025-10-27");
  };

  if (bookingConfirmed) {
    return (
      <div className="pt-5 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Booked Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Your appointment has been confirmed for {formattedDate} at {selectedSlot ? formatTime(selectedSlot.start) : ''}
          </p>
          <button
            onClick={() => {
              setBookingConfirmed(false);
              setSelectedTime("");
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

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
          maxDate={new Date("2025-10-27")}
        // disabledDates={[new Date("2025-09-29"), new Date("2025-09-30")]} 
        />
      </div>

      {/* Time Slots and Booking Preview */}
      <div className="sm:ms-7 sm:ps-5 sm:border-s border-gray-200 dark:border-gray-800 w-full sm:max-w-[20rem] mt-5 sm:mt-0">
        <h3 className="text-gray-900 dark:text-white text-base font-medium mb-3 text-center">
          {formattedDate}
        </h3>

        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {availableTimeSlots.filter(slot => slot.isAvailable).length} slots available
        </div>

        {/* Time Slots Grid */}
        <ul className="grid w-full grid-cols-2 gap-2 mt-3 mb-6">
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

        {availableTimeSlots.filter(slot => slot.isAvailable).length === 0 && (
          <div className="text-center mt-4 text-gray-500 dark:text-gray-400 p-4 bg-gray-50 rounded-lg">
            {isDateException(selectedDate) ?
              "No appointments available due to holiday/exception" :
              "No available time slots for this date"
            }
          </div>
        )}

        {/* Booking Preview */}
        {selectedTime && selectedSlot && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Appointment Summary</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p><span className="font-medium">Date:</span> {formattedDate}</p>
              <p><span className="font-medium">Time:</span> {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</p>
              <p><span className="font-medium">Duration:</span> 1 hour</p>
              <p><span className="font-medium">Time Zone:</span> Eastern Time (Canada)</p>
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={bookAppointmentMutation.isPending}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        )}

        {/* Messages */}
        {bookAppointmentMutation.isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            Error booking appointment: {bookAppointmentMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;