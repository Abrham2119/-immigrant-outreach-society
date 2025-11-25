"use client";
import React from "react";
import { AppointmentResponse } from '@/domain/entities/appointmentPersonnel';

interface PersonnelAppointmentDetailsProps {
  appointment: AppointmentResponse;
}
const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  'no-show': "bg-orange-100 text-orange-800",
  arrived: "bg-purple-100 text-purple-800",
  with_personnel: "bg-indigo-100 text-indigo-800",
};

export const PersonnelAppointmentDetails: React.FC<PersonnelAppointmentDetailsProps> = ({ appointment }) => {
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

  return (
    <div className="w-full max-w-4xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
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
            <p className="text-gray-600 text-sm">+{appointment.client.mobile}</p>
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
            <p className="text-sm text-gray-600">Client Status</p>
            <span className={`px-2 py-1 rounded-full text-xs ${
              statusColors[appointment.client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
            }`}>
              {appointment.client.status}
            </span>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Appointment Information</h3>
          
          <div>
            <p className="text-sm text-gray-600">Date & Time</p>
            <p className="text-gray-800 font-medium">{formatDate(appointment.date)}</p>
            <p className="text-gray-600 text-sm">
              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Appointment Status</p>
            <span className={`px-2 py-1 rounded-full text-xs ${
              statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
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

          <div>
            <p className="text-sm text-gray-600">Services Requested</p>
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
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
        
        {appointment.client.message && (
          <div>
            <p className="text-sm text-gray-600">Client Message</p>
            <p className="text-gray-800 font-medium italic">"{appointment.client.message}"</p>
          </div>
        )}
        
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