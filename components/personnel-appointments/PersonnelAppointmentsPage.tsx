"use client";
import { AppointmentResponse } from '@/domain/entities/appointmentPersonnel';
import { usePersonnelAppointmentManagement } from '@/domain/use-cases/personnelAppointment';
import { formatDateToDDMMYYYYHHMM } from '@/lib/utils/formatDateToDDMMYYYY';
import { Calendar, Clock, Eye, Filter, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import ModalComponent from '../ui/modal/Modal';
import { PersonnelAppointmentDetails } from './PersonnelAppointmentDetails';

// Status options for filtering
const statusOptions = [
  { label: 'All Appointments', value: 'all' },
  { label: 'Booked', value: 'booked' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'With Personnel', value: 'with_personnel' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No Show', value: 'no-show' },
];

const statusColors = {
  booked: "bg-blue-100 text-blue-800 border border-blue-200",
  completed: "bg-green-100 text-green-800 border border-green-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
  'no-show': "bg-orange-100 text-orange-800 border border-orange-200",
  arrived: "bg-purple-100 text-purple-800 border border-purple-200",
  with_personnel: "bg-indigo-100 text-indigo-800 border border-indigo-200",
};

interface AppointmentsListProps {
  onAppointmentSelect?: (appointment: AppointmentResponse) => void;
}

export const PersonnelAppointmentsPage: React.FC<AppointmentsListProps> = ({ onAppointmentSelect }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('booked');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  const [remark, setRemark] = useState<string>('');

  const { usePersonnelAppointments, updateAppointmentStatusMutation, personnelId } = usePersonnelAppointmentManagement();
  
  const { data: appointments = [], isLoading, error } = usePersonnelAppointments(selectedStatus === 'all' ? 'booked' : selectedStatus);

  console.log(usePersonnelAppointments)

  // Filter appointments if 'all' is selected
  const filteredAppointments = selectedStatus === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === selectedStatus);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const openModal = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    onAppointmentSelect?.(appointment);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setRemark('');
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    setStatusUpdateLoading(appointmentId);
    try {
      await updateAppointmentStatusMutation.mutateAsync({
        appointmentId,
        statusData: { 
          status: newStatus,
          ...(remark && { remark }) 
        }
      });
      setRemark('');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
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
  const StatusDropdown = ({ appointment }: { appointment: AppointmentResponse }) => (
    <div className="flex flex-col gap-2 min-w-[120px]">
      <select
        value={appointment.status}
        onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
        disabled={statusUpdateLoading === appointment._id}
        className={`px-2 py-1 rounded text-xs font-medium border outline-none cursor-pointer w-full ${
          statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-300"
        } ${statusUpdateLoading === appointment._id ? 'opacity-50' : ''}`}
      >
        <option value="booked">Booked</option>
        <option value="arrived">Arrived</option>
        <option value="with_personnel">With Personnel</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="no-show">No Show</option>
      </select>
      
      {/* Remark input for specific statuses */}
      {(appointment.status === 'completed' || appointment.status === 'cancelled' || appointment.status === 'no-show') && (
        <input
          type="text"
          placeholder="Add remark..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full"
          maxLength={100}
        />
      )}
    </div>
  );

  if (!personnelId) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-yellow-600">
          <User className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Please log in as personnel to view appointments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-red-600">
          <p className="text-lg font-medium">Error loading appointments</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-600">Manage your scheduled appointments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-800">{filteredAppointments.length}</p>
              </div>
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-purple-800">
                  {appointments.filter(a => a.status === 'with_personnel').length}
                </p>
              </div>
              <User className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Today</p>
                <p className="text-2xl font-bold text-orange-800">
                  {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No {selectedStatus} appointments found</p>
              <p className="text-sm">When you have appointments, they will appear here.</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {appointment.client.firstName.charAt(0)}{appointment.client.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {appointment.client.firstName} {appointment.client.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{appointment.client.email}</p>
                        <p className="text-xs text-gray-500">{appointment.client.mobile}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {appointment.client.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="text-center lg:text-right">
                    <p className="font-semibold text-gray-800">
                      {formatDisplayDate(appointment.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </p>
                    <p className="text-xs text-gray-500">1 hour</p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <StatusDropdown appointment={appointment} />
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        statusColors[appointment.client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                      }`}>
                        Client: {appointment.client.status}
                      </span>
                      
                      <button
                        onClick={() => openModal(appointment)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  Created: {formatDateToDDMMYYYYHHMM(appointment.createdAt)}
                  {appointment.remark && (
                    <span className="ml-3">Remark: "{appointment.remark}"</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {/* <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
        {selectedAppointment && <PersonnelAppointmentDetails appointment={selectedAppointment} />}
      </ModalComponent> */}
    </div>
  );
};