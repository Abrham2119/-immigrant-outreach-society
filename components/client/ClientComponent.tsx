"use client";
import { useClients, useUpdateClientStatus } from '@/application/hooks/useClientManagement';
import { SERVICES, statusOptions } from '@/domain/constants/appointment.constants';
import { statusColors } from '@/domain/constants/ui.constants';
import { Client } from '@/domain/entities/client';
import { getPersonnelsUseCase } from '@/infrastructure/api/personnelService';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Eye, FileText, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ModalComponent from '../ui/modal/Modal';
import { ClientDetails } from './ClientDetails';
import { Pagination } from './Pagination';
import { PersonnelSelectionModal } from './PersonnelSelectionModal';
import { useGetConsentByClientId } from '@/application/hooks/useGetConsentByClientId';
import api from '@/infrastructure/api/axios';

const ConsentDetailsModal = ({
  isOpen,
  onClose,
  clientId
}: {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | null;
}) => {
  const { data: consentData, isLoading, error } = useGetConsentByClientId(clientId);
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (!clientId) return null;
  const exportConsent = async (format: 'pdf') => {
    try {
      const response = await api.get(`/consent/client/${clientId}?exportPDF=true`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: 'application/pdf'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consent-form-${clientId}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportMenu(false);
      toast.success('Consent form exported successfully!');
    } catch (error) {
      console.error('Export PDF failed:', error);
      toast.error('Failed to export consent form as PDF');
    }
  };

  if (isLoading) {
    return (
      <ModalComponent isOpen={isOpen} onClose={onClose}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">Loading consent details...</div>
          </div>
        </div>
      </ModalComponent>
    );
  }

  if (error) {
    return (
      <ModalComponent isOpen={isOpen} onClose={onClose}>
        <div className="p-4 sm:p-6">
          <div className="text-center text-red-600">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Error Loading Consent</h2>
            <p>Failed to load consent details. Please try again.</p>
          </div>
        </div>
      </ModalComponent>
    );
  }

  if (!consentData?.consentForm) {
    return (
      <ModalComponent isOpen={isOpen} onClose={onClose}>
        <div className="p-4 sm:p-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">No Consent Found</h2>
            <p>No consent form found for this client.</p>
          </div>
        </div>
      </ModalComponent>
    );
  }

  const { consentForm } = consentData;

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full w-full max-h-[90vh] sm:max-h-[85vh]">
        {/* Header with Export Button */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-center flex-1">Consent Form Details</h2>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={16} />
                Export
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => exportConsent('pdf')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-gray-700 flex items-center gap-2"
                  >
                    <span className="text-red-500 font-medium">PDF</span>
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Data Entry Personnel */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 text-blue-600">Data Entry Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <strong className="text-gray-700 text-sm sm:text-base">Personnel Name:</strong>
                  <p className="mt-1 text-sm sm:text-base">{consentForm.formData.data_entry_personnel_name}</p>
                </div>
                <div>
                  <strong className="text-gray-700 text-sm sm:text-base">Consent Given:</strong>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${consentForm.formData.consent
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {consentForm.formData.consent ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-md max-h-96 overflow-y-auto">
              <div className="text-sm text-gray-700 space-y-4">
                <p>
                  Immigrant Outreach Society (IOS) is a community-based non-profit organization that provides mental health intervention and psychological services for refugees and ethnic minorities from East Africa, including Ethiopia, Eritrea, Somalia, Sudan, and South Sudan.
                </p>

                <div>
                  <h3 className="font-semibold mb-2">Confidentiality:</h3>
                  <p className="mb-3">
                    One of the most important rights of the person seeking counseling is confidentiality. Information revealed by you during counseling sessions will be kept strictly confidential and will not be revealed to any other person or agency without your written permission, with the following exceptions:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>If an individual intends to take harmful, dangerous, or criminal action against another human being, or against himself or herself, it is our duty to warn appropriate individuals or agencies of such intentions.</li>
                    <li>Any suspected or confirmed acts of abuse towards a child, elder or vulnerable person (including physical abuse, sexual abuse, unlawful sexual intercourse, neglect, emotional and psychological abuse) will need to be reported to the appropriate agencies by the counsellor.</li>
                    <li>When the courts believe that a client's counsellor may have valuable information for their case, they will subpoena her/his notes, records, and in some instances, even the counsellor themselves.</li>
                    <li>Information about you may be discussed in confidence, without revealing your identity, with other psychosocial support professionals and or supervisors for the purpose of consultation and providing you with the best possible service.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Minors:</h3>
                  <p>
                    If you are under 18 years of age, please be aware that the law may provide your parents the right to examine your records. It is our policy to request an agreement from parents that they agree to give up access to your records. If they agree, we will provide them only with general information about our work together, unless we feel there is a high risk that you will harm yourself or someone else. In this case, we will notify them of my concern. Before giving them any information, we will discuss the matter with you, if possible, and do my best to handle any concerns you may have with what I am prepared to discuss.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Emergencies:</h3>
                  <p>
                    IOS doesn't provide emergency or crisis related services. If you have an emergency or are experiencing a crisis, please go the local hospital or emergency, call the Distress Centre (403-266-4357), or 911.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Acknowledgement and Consent:</h3>
                  <p>
                    Upon signing below, you are indicating that you have read and understood this consent form and that any questions you had about this consent form were answered to your satisfaction, and that you were provided a copy of this document. You agree to accept the psychosocial support services as detailed above.
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 text-green-600">Client Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <strong className="text-gray-700 text-sm sm:text-base">Full Name:</strong>
                  <p className="mt-1 text-sm sm:text-base">{consentForm.formData.client_full_name}</p>
                </div>
                <div>
                  <strong className="text-gray-700 text-sm sm:text-base">Date Signed:</strong>
                  <p className="mt-1 text-sm sm:text-base">{new Date(consentForm.formData.client_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <strong className="text-gray-700 text-sm sm:text-base">Signature:</strong>
                <div className="mt-2 border rounded p-2 bg-white">
                  <img
                    src={consentForm.formData.client_signature}
                    alt="Client Signature"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '100px' }}
                  />
                </div>
              </div>
            </div>

            <div className="pb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 text-purple-600">IOS Staff Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <strong className="text-gray-700 text-sm sm:text-base">Staff Name:</strong>
                  <p className="mt-1 text-sm sm:text-base">{consentForm.formData.ios_staff_full_name}</p>
                </div>
                <div>
                  <strong className="text-gray-700 text-sm sm:text-base">Date Signed:</strong>
                  <p className="mt-1 text-sm sm:text-base">{new Date(consentForm.formData.ios_staff_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <strong className="text-gray-700 text-sm sm:text-base">Signature:</strong>
                <div className="mt-2 border rounded p-2 bg-white">
                  <img
                    src={consentForm.formData.ios_staff_signature}
                    alt="IOS Staff Signature"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '100px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [status, setStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [selectedClientForBooking, setSelectedClientForBooking] = useState<string | null>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [selectedConsentData, setSelectedConsentData] = useState<string | null>(null);

  const { data, isLoading, error } = useClients(pageNum, pageSize, search, status);
  const updateClientStatusMutation = useUpdateClientStatus();

  // Fetch personnels
  const { data: personnelsData = [], isLoading: isLoadingPersonnels } = useQuery({
    queryKey: ['personnels'],
    queryFn: getPersonnelsUseCase,
  });
  const personnels = Array.isArray(personnelsData) ? [] : personnelsData?.employees || []

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
    openAppointmentBookingModal(clientId, personnelId);
  };

  const openAppointmentBookingModal = (clientId: string, personnelId: string) => {
    // Implement your appointment booking modal logic here
  };

  const handleStatusUpdate = (clientId: string, newStatus: string) => {
    setStatusUpdateLoading(clientId);
    updateClientStatusMutation.mutate(
      {
        clientId,
        statusData: { status: newStatus }
      },
      {
        onSuccess: () => {
          toast.success('Client status updated successfully!');
          setStatusUpdateLoading(null);
        },
        onError: (error: Error) => {
          const axiosError = error as any;
          const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error occurred';
          toast.error(`Error updating status: ${errorMessage}`);
          setStatusUpdateLoading(null);
        }
      }
    );
  };

  // Function to handle consent form click
  const handleConsentFormClick = (client: Client) => {
    if (client.consent) {
      setSelectedConsentData(client._id);
      setIsConsentModalOpen(true);
    } else {
      router.push(`/dashboard/receptionist/clients/consent?clientId=${client._id}`);
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
      disabled={statusUpdateLoading === client._id || !client.consent}
      className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${statusColors[client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
        } ${statusUpdateLoading === client._id ? 'opacity-50' : ''} ${!client.consent ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!client.consent ? "Consent required to update status" : ""}
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
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9\s.@]/g, '');
                handleSearchChange(value);
              }}
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
                <th className="text-center px-4 py-2 text-lg font-medium">
                  Status
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium">
                  Consent
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
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <StatusDropdown client={client} />
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.consent
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {client.consent ? 'Yes' : 'No'}
                      </span>
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
                        onClick={() => handleConsentFormClick(client)}
                        title={client.consent ? "View Consent Form" : "Consent Required"}
                        className="relative group"
                      >
                        <FileText size={16} />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          {client.consent ? "View Consent" : "Consent Required"}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </button>
                      <button
                        onClick={() => openPersonnelModal(client._id)}
                        disabled={!client.consent}
                        className={`${client.consent ? 'text-green-600 hover:text-green-800' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
                        title={client.consent ? "Book Appointment" : "Consent required to book appointment"}
                      >
                        <Calendar size={16} />
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

      {/* Modals */}
      <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
        {selectedClientId && <ClientDetails id={selectedClientId} />}
      </ModalComponent>

      <PersonnelSelectionModal
        isOpen={isPersonnelModalOpen}
        onClose={closePersonnelModal}
        personnels={personnels}
        clientId={selectedClientForBooking || ''}
        onPersonnelSelect={handlePersonnelSelect}
        isLoading={isLoadingPersonnels}
      />

      <ConsentDetailsModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        clientId={selectedConsentData}
      />
    </div>
  );
}
export { ConsentDetailsModal };