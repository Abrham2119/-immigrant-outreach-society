"use client";
import ModalComponent from '@/components/ui/modal/Modal';
import { Appointment } from '@/domain/entities/geAppointment';
import { useAppointmentManagement } from '@/domain/use-cases/getAppointment';
import { formatDateToDDMMYYYYHHMM } from '@/lib/utils/formatDateToDDMMYYYY';
import { Calendar, Clock, Eye, User, Users } from 'lucide-react';
import { useState } from 'react';
import { AppointmentDetails } from './AppointmentDetails';
import { Client } from '@/domain/entities/client';
import { useClientManagement } from '@/domain/use-cases/client';

// Status options and colors
const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Booked', value: 'booked' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No Show', value: 'no-show' },
];

const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  'no-show': "bg-orange-100 text-orange-800",
};

export default function AppointmentsPage() {
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
    const { updateClientStatusMutation } = useClientManagement();
  

  const { useAppointments, updateAppointmentStatusMutation } = useAppointmentManagement();
  
const { data: appointments = [], isLoading, error } = useAppointments(1, 10, "", "all");

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

    const handleStatusUpdate = async (clientId: string, newStatus: string) => {
    setStatusUpdateLoading(clientId);
    try {
      await updateClientStatusMutation.mutateAsync({
        clientId,
        statusData: { status: newStatus }
      });
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const openModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };


  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = search === '' || 
      appointment.client.firstName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.client.lastName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.personnel.firstName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.personnel.lastName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = status === 'all' || appointment.status === status;
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Status dropdown component for each row
  const StatusDropdown = ({ appointment }: { appointment: Appointment }) => (
    <select
      value={appointment.status}
      onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
      disabled={statusUpdateLoading === appointment._id}
      className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
        } ${statusUpdateLoading === appointment._id ? 'opacity-50' : ''}`}
    >
      <option value="upcoming">Upcoming</option>
      <option value="arrived">Arrived</option>
      <option value="with_personnel">With Personnel</option>
    </select>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
          <div className="text-center py-8 text-red-600">
            Error loading appointments: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
        {/* Header */}
        <div className="flex lg:flex-row gap-4 flex-col justify-start md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-600">Manage and view all appointments</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex border-[#000000]/50 border items-center rounded-[10px] md:w-[300px] h-[34px]">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search appointments..."
                className="outline-none placeholder:text-[14px] px-3 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#000000]/50">
                Status
              </span>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-[#000000]/50 rounded-[10px] px-3 py-1 outline-none text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-800">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Booked</p>
                <p className="text-2xl font-bold text-green-800">
                  {appointments.filter(a => a.status === 'booked').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-orange-800">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-red-800">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto border border-[#71717180]/50 min-h-[60vh] text-[#555555]">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-white border-b-[#00000080]/50 border-b">
                <th className="text-left py-3 px-4 text-lg font-medium">Client</th>
                <th className="text-left px-4 py-3 text-lg font-medium">Personnel</th>
                <th className="text-left px-4 py-3 text-lg font-medium">Date & Time</th>
                <th className="text-left px-4 py-3 text-lg font-medium">Duration</th>
                <th className="text-left px-4 py-3 text-lg font-medium">Status</th>
                <th className="text-left px-4 py-3 text-lg font-medium">Created</th>
                <th className="text-left px-4 py-3 text-lg font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                      Loading appointments...
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <tr
                    key={appointment._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"} hover:bg-gray-50`}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.client.firstName} {appointment.client.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.client.email}</p>
                        <p className="text-xs text-gray-500">{appointment.client.mobile}</p>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.personnel.firstName} {appointment.personnel.lastName}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{appointment.personnel.role}</p>
                        <p className="text-xs text-gray-500">{appointment.personnel.email}</p>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDisplayDate(appointment.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      1 hour
                    </td>
                    
                    <td className="px-4 py-4">
                      <StatusDropdown appointment={appointment} />
                    </td>
                    
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDateToDDMMYYYYHHMM(appointment.createdAt)}
                    </td>
                    
                    <td className="px-4 py-4">
                      <button
                        onClick={() => openModal(appointment._id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
        {selectedAppointmentId && <AppointmentDetails id={selectedAppointmentId} />}
      </ModalComponent>
    </div>
  );
}