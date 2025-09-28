'use client';
import { useState } from "react";
import { AppointmentStatus } from "@/domain/entities/appointmentPersonnel";
import { PersonnelAppointmentsPage } from "@/components/personnel-appointments/PersonnelAppointmentsPage";

export default function AppointmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('booked');

  return (
    <div>
      <h2 className="text-2xl text-[#555555] font-semibold mb-2">
        My Appointments
      </h2>

      <PersonnelAppointmentsPage 
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}