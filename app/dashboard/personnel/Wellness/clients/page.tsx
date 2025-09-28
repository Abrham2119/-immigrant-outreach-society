'use client';
import { useState } from "react";
import { AppointmentStatus } from "@/domain/entities/appointmentPersonnel";
import { PersonnelAppointmentsPage } from "@/components/personnel-appointments/PersonnelAppointmentsPage";

export default function AppointmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('booked');

  return (
    <div>    
      <PersonnelAppointmentsPage 
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}