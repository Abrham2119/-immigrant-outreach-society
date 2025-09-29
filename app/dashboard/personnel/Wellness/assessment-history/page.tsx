"use client";
import { Pagination } from '@/components/client/Pagination';
import { useFormManagement } from '@/domain/use-cases/form';
import { useQuery } from '@tanstack/react-query';
import { Eye, FileText, User } from 'lucide-react';
import { useState } from 'react';
import { FormDetails } from './FormDetails';
import ModalComponent from '@/components/ui/modal/Modal';


// Service options
const serviceOptions = [
  { label: 'All Services', value: 'all' },
  { label: 'PCO', value: 'PCO' },
{ label: 'Wellness Intervention', value: 'Wellness' },
  { label: 'IOCR', value: 'IOCR' },
  { label: 'Settlement', value: 'Settlement' },
  { label: 'Psychosocial', value: 'Psychosocial' },
  { label: 'Youth', value: 'Youth' },
  { label: 'SALP', value: 'SALP' },
  { label: 'GBV', value: 'GBV' },
  { label: 'Training', value: 'Training' },
  { label: 'Policy', value: 'Policy' }
];

// Service colors mapping
const serviceColors = {
  PCO: "bg-blue-100 text-blue-800",
  Wellness: "bg-green-100 text-green-800",
  IOCR: "bg-purple-100 text-purple-800",
  Settlement: "bg-orange-100 text-orange-800",
  Psychosocial: "bg-pink-100 text-pink-800",
  Youth: "bg-indigo-100 text-indigo-800",
  SALP: "bg-teal-100 text-teal-800",
  GBV: "bg-red-100 text-red-800",
  Training: "bg-yellow-100 text-yellow-800",
  Policy: "bg-gray-100 text-gray-800",
};

export default function FormsPage() {
  const [search, setSearch] = useState<string>("");
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [service, setService] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const { useForms } = useFormManagement();

  const { data, isLoading, error } = useForms(pageNum, pageSize, search, service);
  console.log(data)

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageNum(1);
  };

  const handleServiceChange = (value: string) => {
    setService(value);
    setPageNum(1);
  };

  const handlePagination = (page: number) => {
    setPageNum(page);
  };

  const openModal = (formId: string) => {
    setSelectedFormId(formId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFormId(null);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get client display name
  const getClientName = (form: any) => {
    if (form.client) {
      return `${form.client.firstName} ${form.client.lastName}`;
    }
    
    // Try to get name from formData
    if (form.formData.client_name) {
      return form.formData.client_name;
    }
    
    if (form.formData['Referral Individual\'s Name']) {
      return form.formData['Referral Individual\'s Name'];
    }
    
    return 'N/A';
  };

  // Function to get personnel display name
  const getPersonnelName = (form: any) => {

    console.log(form,"this is personale name")
    if (form.personnel) {
      return `${form.personnel.firstName} ${form.personnel.lastName}`;
    }
    
    // Try to get name from formData
    if (form.formData.data_entry_personnel_full_name) {
      return form.formData.data_entry_personnel_full_name;
    }
    
    if (form.formData['Data Entry personnel full name']) {
      return form.formData['Data Entry personnel full name'];
    }
    
    return 'N/A';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-[1px] md:p-4 md:border-[#000000]/20 md:border w-full">
          <div className="text-center py-8 text-red-600">
            Error loading forms: {error.message}
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
              placeholder="Search forms..."
              className="outline-none placeholder:text-[16px] px-2 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-[#000000]/50">
              Service
            </span>
            <select
              value={service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="border border-[#000000]/50 rounded-[10px] px-3 py-1 outline-none"
            >
              {serviceOptions.map(option => (
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
                  Form ID
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Client Name
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Personnel
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Service
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium whitespace-nowrap">
                  Created Date
                </th>
                <th className="text-center px-4 py-2 text-lg font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="w-full min-h-[60vh] flex items-center justify-center text-center">
                      Loading forms...
                    </div>
                  </td>
                </tr>
              ) : data?.forms?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No forms found.
                  </td>
                </tr>
              ) : (
                data?.forms?.map((form, index) => (
                  <tr
                    key={form._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#F7F7F7]"}`}
                  >
                    <td className="py-3 pl-3 whitespace-nowrap text-[14px] font-medium text-center">
                      {form._id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <User size={16} className="text-gray-500" />
                        {getClientName(form)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      {getPersonnelName(form)}
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        serviceColors[form.service as keyof typeof serviceColors] || "bg-gray-100 text-gray-800"
                      }`}>
                        {form.service}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[14px] whitespace-nowrap text-center font-medium">
                      {formatDate(form.createdAt)}
                    </td>
                    <td className="px-4 py-4 flex gap-2 items-center justify-center text-center font-medium">
                     <button
    onClick={() => form?.client?._id && openModal(form.client._id)}
    className={`text-blue-600 hover:text-blue-800 transition-colors ${
      !form?.client?._id ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    title={form?.client?._id ? "View Client Details" : "No client data available"}
    disabled={!form?.client?._id}
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

        {data && (
          <Pagination
            pageNum={pageNum}
            totalPages={data.pages || 1}
            onPageChange={handlePagination}
          />
        )}
      </div>

      {/* Form Details Modal */}
      <ModalComponent isOpen={isModalOpen} onClose={closeModal}>
        {selectedFormId && <FormDetails id={selectedFormId} />}
      </ModalComponent>
    </div>
  );
}