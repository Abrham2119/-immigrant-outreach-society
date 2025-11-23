"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AppointmentBooking from './AppointmentBooking';

interface AppointmentPageProps {
  clientId: string;
  personnelId: string;
  onClose?: () => void; 
}

const AppointmentPage: React.FC<AppointmentPageProps> = ({ 
  clientId, 
  personnelId ,
  onClose 
}) => {
  const router = useRouter();

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
            <p className="text-gray-600">
              Select a date and time for your appointment with our wellness specialist
            </p>
          </div>          
          <AppointmentBooking 
            clientId={clientId}
            personnelId={personnelId}
          />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">📍 Location</h3>
            <p className="text-sm text-gray-600">Weliness Center, Calgary, Alberta, Canada</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">⏰ Duration</h3>
            <p className="text-sm text-gray-600">1 hour sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;