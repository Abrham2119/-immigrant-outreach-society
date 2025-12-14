"use client";
import { EmergencyAlertStatus } from "@/components/client/EmergencyAlertStatus";
import { useAppointment } from "@/domain/use-cases/getAppointment";
import React from "react";

interface AppointmentDetailsProps {
  id: string;
}
const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  emergency_alert: "bg-red-500 text-white",
  accepted: "bg-green-100 text-green-800",
};

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ id }) => {
  const { data: appointment, isLoading, error } = useAppointment(id);


  if (isLoading) {
    return (
      <div className="w-full max-w-4xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl p-6">
        <div className="text-red-600 text-center">
          Error loading appointment details: {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="w-full max-w-4xl p-6">
        <div className="text-gray-600 text-center">
          Appointment not found.
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  console.log("this is the details", appointment)

  return (
    <div className="w-full max-w-4xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Client Information</h3>

          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="text-gray-800 font-medium">
              {appointment.client.firstName} {appointment.client.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Contact Information</p>
            <p className="text-gray-800 font-medium">{appointment.client.email}</p>
            <p className="text-gray-600 text-sm">{appointment.client.mobile}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Demographics</p>
            <p className="text-gray-800 font-medium capitalize">{appointment.client.gender}</p>
            <p className="text-gray-600 text-sm">{appointment.client.nationality} • {appointment.client.immigrationStatus}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Language</p>
            <p className="text-gray-800 font-medium">{appointment.client.language}</p>
          </div>
            <div>
                        
                        <EmergencyAlertStatus
                          status={appointment.client.emergency_alert?.status === true}
                          reason={appointment.client.emergency_alert?.reason}
                        />
                      </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Appointment Information</h3>

          <div>
            <p className="text-sm text-gray-600">Service Provider</p>
            <p className="text-gray-800 font-medium">
              {appointment.personnel.firstName} {appointment.personnel.lastName}
            </p>
            <p className="text-gray-600 text-sm capitalize">{appointment.personnel.role}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Date & Time</p>
            <p className="text-gray-800 font-medium">{formatDate(appointment.date)}</p>
            <p className="text-gray-600 text-sm">
              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
              }`}>
              {appointment.status}
            </span>
          </div>

          {appointment.remark && (
            <div>
              <p className="text-sm text-gray-600">Remarks</p>
              <p className="text-gray-800 font-medium italic">"{appointment.remark}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>

        <div>
          <p className="text-sm text-gray-600">Client Services</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {appointment.client.services.map((service, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Appointment Created</p>
          <p className="text-gray-800 font-medium">
            {new Date(appointment.createdAt).toLocaleDateString()} at{" "}
            {new Date(appointment.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-gray-800 font-medium">
              {new Date(appointment.updatedAt).toLocaleDateString()} at{" "}
              {new Date(appointment.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};