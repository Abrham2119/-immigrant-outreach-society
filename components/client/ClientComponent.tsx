"use client";
import { Client } from '@/domain/entities/client';
import { useClientManagement } from '@/domain/use-cases/client';
import { getPersonnelsUseCase } from '@/infrastructure/api/personnelService';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import ModalComponent from '../ui/modal/Modal';
import { ClientDetails } from './ClientDetails';
import { Pagination } from './Pagination';
import { PersonnelSelectionModal } from './PersonnelSelectionModal';

// Status options matching your API
const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'With Personnel', value: 'with_personnel' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
];
// Status colors mapping
// Update your status colors mapping to include all statuses
const statusColors = {
  upcoming: "bg-yellow-100 text-yellow-800",
  arrived: "bg-blue-100 text-blue-800",
  with_personnel: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const SERVICES = [
  { value: "PCO", label: "Proactive Community Outreach" },
  { value: "Wellness", label: "Wellness Intervention" },
  { value: "IOCR", label: "Immigration Crisis Response" },
  { value: "Settlement", label: "Settlement & Integration" },
  { value: "Psychosocial", label: "Psychosocial Wellbeing" },
  { value: "Youth", label: "Youth Program" },
  { value: "SALP", label: "Senior Active Living Program (SALP)" },
  { value: "GBV", label: "Gender-Based Violence (GBV) Program" },
  { value: "Training", label: "Training and Workshops" },
  { value: "Policy", label: "Policy Influencing and Advocacy for Antiracism Initiatives" }
];

export default function ClientsPage() {
  const [search, setSearch] = useState<string>("");
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [status, setStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [selectedClientForBooking, setSelectedClientForBooking] = useState<string | null>(null);

  const { useClients, updateClientStatusMutation } = useClientManagement();

  const { data, isLoading, error } = useClients(pageNum, pageSize, search, status);

  // Fetch personnels
  const { data: personnels = [], isLoading: isLoadingPersonnels } = useQuery({
    queryKey: ['personnels'],
    queryFn: getPersonnelsUseCase,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageNum(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPageNum(1);
  };

  const handlePagination = (page: number) => {
    setPageNum(page);
  };

  const openModal = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
  };

  const openPersonnelModal = (clientId: string) => {
    setSelectedClientForBooking(clientId);
    setIsPersonnelModalOpen(true);
  };

  const closePersonnelModal = () => {
    setIsPersonnelModalOpen(false);
    setSelectedClientForBooking(null);
  };

  const handlePersonnelSelect = (clientId: string, personnelId: string) => {
    // Here you can navigate to the appointment booking page or open another modal
    console.log('Booking appointment for:', { clientId, personnelId });

    // Example: Navigate to appointment booking page
    // router.push(`/book-appointment?clientId=${clientId}&personnelId=${personnelId}`);

    // Or open appointment booking modal
    openAppointmentBookingModal(clientId, personnelId);
  };

  const openAppointmentBookingModal = (clientId: string, personnelId: string) => {
    // Implement your appointment booking modal logic here
    // alert(`Booking appointment for Client: ${clientId} with Personnel: ${personnelId}`);
    // You can integrate your existing appointment booking component here
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

  // Function to display services with hover effect
  const renderServices = (services: string[]) => {
    if (!services || services.length === 0) return "-";

    const serviceLabels = services.map(serviceValue => {
      const service = SERVICES.find(s => s.value === serviceValue);
      return service ? service.label : serviceValue;
    });

    return (
      <div className="relative group inline-block text-center">
        <span className="cursor-pointer underline decoration-dotted">
          {serviceLabels[0]}
          {serviceLabels.length > 1 && ` +${serviceLabels.length - 1}`}
        </span>
        {serviceLabels.length > 1 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            <div className="flex flex-col">
              {serviceLabels.map((serviceLabel, index) => (
                <span key={index}>{serviceLabel}</span>
              ))}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    );
  };

  // Status dropdown component for each row
  const StatusDropdown = ({ client }: { client: Client }) => (
    <select
      value={client.status}
      onChange={(e) => handleStatusUpdate(client._id, e.target.value)}
      disabled={statusUpdateLoading === client._id}
      className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${statusColors[client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
        } ${statusUpdateLoading === client._id ? 'opacity-50' : ''}`}
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
            Error loading clients: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
        {/* Header Actions */}
        <div className="flex lg:flex-row gap-4 flex-col justify-start md:justify-between mb-3">
          <div className="flex border-[#000000]/50 border items-center rounded-[10px] md:w-[531px] h-[34px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search clients..."
              className="outline-none placeholder:text-[16px] px-2 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-[#000000]/50">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-[#000000]/50 rounded-[10px] px-3 py-1 outline-none"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#71717180]/50 min-h-[60vh] text-[#555555]">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-white border-b-[#00000080]/50 border-b">
                <th className="text-center py-2 px-4 text-lg font-medium whitespace-nowrap">
                  ID
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Name
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Phone number
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Email
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Services
                </th>
                {/* <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Registered On
                </th> */}
                <th className="text-center px-4 py-2 text-lg font-medium">
                  Status
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                      Loading clients...
                    </div>
                  </td>
                </tr>
              ) : data?.clients?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No clients found.
                  </td>
                </tr>
              ) : (
                data?.clients?.map((client, index) => (
                  <tr
                    key={client._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"}`}
                  >
                    <td className="py-3 pl-3 whitespace-nowrap text-[14px] font-medium text-center">
                      {client._id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      {`${client.firstName} ${client.lastName}`}
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      +{client.mobile}
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      {client.email}
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      {renderServices(client.services)}
                    </td>
                    {/* <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      {formatDateToDDMMYYYYHHMM(client.createdAt)}
                    </td> */}
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <StatusDropdown client={client} />
                    </td>
                    <td className="px-4 py-4 flex gap-2 items-center justify-center text-center font-medium">
                      <button
                        onClick={() => openModal(client._id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openPersonnelModal(client._id)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Book Appointment"
                      >
                        <Calendar size={16} />
                      </button>
                      <button
                        onClick={() => {/* Add your concent form logic here */ }}
                        className="text-purple-600 hover:text-purple-800 transition-colors relative group"
                        title="Concent Form"
                      >
                        <FileText size={16} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          Concent Form
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

        {data && (
          <Pagination
            pageNum={pageNum}
            totalPages={data.pages}
            onPageChange={handlePagination}
          />
        )}
      </div>

      {/* Client Details Modal */}
      <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
        {selectedClientId && <ClientDetails id={selectedClientId} />}
      </ModalComponent>

      {/* Personnel Selection Modal */}
      <PersonnelSelectionModal
        isOpen={isPersonnelModalOpen}
        onClose={closePersonnelModal}
        personnels={personnels}
        clientId={selectedClientForBooking || ''}
        onPersonnelSelect={handlePersonnelSelect}
        isLoading={isLoadingPersonnels}
      />
    </div>
  );
}