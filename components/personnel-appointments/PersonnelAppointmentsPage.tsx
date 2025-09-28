"use client";
import { usePersonnelAppointmentManagement } from '@/application/hooks/usePersonnelAppointments';
import { AppointmentResponse, AppointmentStatus } from '@/domain/entities/appointmentPersonnel';
import { Eye, User, FileText } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalComponent from '../ui/modal/Modal';
import { PersonnelAppointmentDetails } from './PersonnelAppointmentDetails';

const statusColors = {
  booked: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  'no-show': "bg-orange-100 text-orange-800",
  arrived: "bg-purple-100 text-purple-800",
  with_personnel: "bg-indigo-100 text-indigo-800",
};

interface PersonnelAppointmentsPageProps {
  selectedStatus?: AppointmentStatus;
  onStatusChange?: (status: AppointmentStatus) => void;
}

// Assessment form options with slugs for routing
const assessmentForms = [
  { id: 'mental-health', title: 'Mental Health Assessment', slug: 'mental-health' },
  { id: 'physical-health', title: 'Physical Health Assessment', slug: 'physical-health' },
  { id: 'psychosocial', title: 'Psychosocial Assessment', slug: 'psychosocial' },
  { id: 'intake', title: 'Intake Assessment', slug: 'intake' },
  { id: 'risk', title: 'Risk Assessment', slug: 'risk' },
  { id: 'progress', title: 'Progress Assessment', slug: 'progress' },
  { id: 'discharge', title: 'Discharge Assessment', slug: 'discharge' },
  { id: 'psychosocial-intake', title: 'Psychosocial Intake Assessment', slug: 'psychosocial-intake' },
  { id: 'wellness-check', title: 'Wellness Check Assessment', slug: 'wellness-check' },
  { id: 'crisis-evaluation', title: 'Crisis Evaluation', slug: 'crisis-evaluation' },
];

export const PersonnelAppointmentsPage: React.FC<PersonnelAppointmentsPageProps> = ({ 
  selectedStatus: externalStatus, 
  onStatusChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [selectedAppointmentForAssessment, setSelectedAppointmentForAssessment] = useState<AppointmentResponse | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  const [remark, setRemark] = useState<string>('');
  const router = useRouter();

  const { personnelId, usePersonnelAppointments, useUpdateAppointmentStatus } = usePersonnelAppointmentManagement();
  
  const { data: appointmentsData, isLoading, error } = usePersonnelAppointments({
    personnelId: personnelId!,
    status: 'booked'
  });
  
  const updateAppointmentStatusMutation = useUpdateAppointmentStatus();

  const appointments = appointmentsData?.data || [];

  const openModal = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setRemark('');
  };

  const openAssessmentModal = (appointment: AppointmentResponse) => {
    setSelectedAppointmentForAssessment(appointment);
    setIsAssessmentModalOpen(true);
  };

  const closeAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
    setSelectedAppointmentForAssessment(null);
  };

  const handleFormSelect = (formSlug: string) => {
    if (selectedAppointmentForAssessment) {
      // Navigate to the form page in the Wellness dashboard with the appointment ID and client ID
      const formPath = `/dashboard/personnel/Wellness//assessment/${formSlug}`;
      router.push(formPath);
    }
    closeAssessmentModal();
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
    } catch (error) {
      console.error('Failed to update appointment status:', error);
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
    <select
      value={appointment.status}
      onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
      disabled={statusUpdateLoading === appointment._id}
      className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${
        statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
      } ${statusUpdateLoading === appointment._id ? 'opacity-50' : ''}`}
    >
      <option value="booked">Booked</option>
      <option value="arrived">Arrived</option>
      <option value="with_personnel">With Personnel</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
      <option value="no-show">No Show</option>
    </select>
  );

  if (!personnelId) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
          <div className="text-center py-8 text-yellow-600">
            <User className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Please log in as personnel to view appointments</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
          <div className="text-center py-8 text-red-600">
            Error loading appointments: {(error as Error).message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600">Manage your scheduled appointments</p>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto border border-[#71717180]/50 min-h-[60vh] text-[#555555]">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-white border-b-[#00000080]/50 border-b">
                <th className="text-center py-3 px-4 text-lg font-medium whitespace-nowrap">
                  Client
                </th>
                <th className="text-center px-4 py-3 text-lg font-medium whitespace-nowrap">
                  Contact
                </th>
                <th className="text-center px-4 py-3 text-lg font-medium whitespace-nowrap">
                  Services
                </th>
                <th className="text-center px-4 py-3 text-lg font-medium whitespace-nowrap">
                  Date & Time
                </th>
                <th className="text-center px-4 py-3 text-lg font-medium">
                  Status
                </th>
                <th className="text-center px-4 py-3 text-lg font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                      Loading appointments...
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => (
                  <tr
                    key={appointment._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"}`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-[14px] font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">
                            {appointment.client.firstName.charAt(0)}{appointment.client.lastName.charAt(0)}
                          </span>
                        </div>
                        <span>
                          {appointment.client.firstName} {appointment.client.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <div className="flex flex-col gap-1">
                        <span>{appointment.client.email}</span>
                        <span className="text-gray-500">+{appointment.client.mobile}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {appointment.client.services.slice(0, 2).map((service, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                        {appointment.client.services.length > 2 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{appointment.client.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                          {formatDisplayDate(appointment.date)}
                        </span>
                        <span className="text-gray-500">
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <StatusDropdown appointment={appointment} />
                    </td>
                    <td className="px-4 py-4 flex gap-2 items-center justify-center text-center font-medium">
                      <button
                        onClick={() => openModal(appointment)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openAssessmentModal(appointment)}
                        className="text-green-600 hover:text-green-800 transition-colors relative group"
                        title="Assessment Forms"
                      >
                        <FileText size={16} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          Assessment Forms
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
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
        {selectedAppointment && <PersonnelAppointmentDetails appointment={selectedAppointment} />}
      </ModalComponent>

      {/* Assessment Forms Modal */}
      <ModalComponent isOpen={isAssessmentModalOpen} onClose={closeAssessmentModal}>
        <div className="w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Form</h2>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {assessmentForms.map((form) => (
              <button
                key={form.id}
                onClick={() => handleFormSelect(form.slug)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-medium">{form.title}</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </button>
            ))}
          </div>

          {selectedAppointmentForAssessment && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected Client: <span className="font-medium">{selectedAppointmentForAssessment.client.firstName} {selectedAppointmentForAssessment.client.lastName}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Appointment: {formatDisplayDate(selectedAppointmentForAssessment.date)} at {formatTime(selectedAppointmentForAssessment.startTime)}
              </p>
            </div>
          )}
        </div>
      </ModalComponent>
    </div>
  );
};