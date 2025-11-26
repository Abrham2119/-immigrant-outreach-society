'use client';
import { PersonnelAppointmentsAllClientsPage } from "@/components/personnel-appointments/PersonnelAppointmentsAllClientsPage";
import { AppointmentStatus } from "@/domain/entities/appointmentPersonnel";
import { useState } from "react";

export default function AppointmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('booked');

  return (
    <div>
      <PersonnelAppointmentsAllClientsPage
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}