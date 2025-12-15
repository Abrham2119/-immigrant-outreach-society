"use client";
import { useTranslation } from '@/components/providers/translation.provider';
import { FormDetailsMapper } from '@/components/forms/form-details/FormDetailsMapper';
import ModalComponent from '@/components/ui/modal/Modal';
import { Client, Personnel, Form } from '@/domain/entities/form';
import { useForm, useFormsByClient } from '@/domain/use-cases/form';
import api from '@/infrastructure/api/axios';
import { Download, History } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ContentProtectionWrapper } from '../ContentProtectionWrapper';
import { EmergencyAlertButton } from '../ui/Button/EmergencyAlertButton';

interface ClientFormsHistoryProps {
  clientId: string;
  clientName: string;
}

export const ClientFormsHistory: React.FC<ClientFormsHistoryProps> = ({
  clientId,
  clientName
}) => {
  const { t } = useTranslation();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const { data: formsResponse, isLoading, error } = useFormsByClient(clientId);
  const { data: selectedFormResponse, isLoading: isFormLoading } = useForm(selectedFormId || '');

  // Updated to match the new response structure
  const forms = formsResponse?.data || [];
  const selectedForm = selectedFormResponse?.form; // CHANGED: Use .form instead of .data
  const totalCount = formsResponse?.meta?.total || 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFormId(null);
  };
  const openFormDetails = (formId: string) => setSelectedFormId(formId);
  const closeFormDetails = () => setSelectedFormId(null);

  const exportForms = async (format: 'pdf' | 'excel') => {
    try {
      const response = await api.get(`/forms/client/${clientId}?export${format === 'excel' ? 'Excel' : 'PDF'}=true`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forms-${clientName}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportMenu(false);
    } catch (error) {
      console.error(`${t('exportFailed', 'Export')} ${format} ${t('failed', 'failed:')}`, error);
      alert(`${t('failedToExport', 'Failed to export')} ${format === 'excel' ? 'Excel' : 'PDF'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFormTitle = (title: string | undefined): string => {
    if (!title) return t('notApplicable', 'N/A');
    return title
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPersonnelName = (form: Form) => {
    return `${form.personnel?.firstName} ${form.personnel?.lastName}`;
  };

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

  return (
    <>
      <button
        onClick={openModal}
        className="text-purple-600 hover:text-purple-800 transition-colors relative group"
        title={t('viewFormHistoryTooltip', 'View Form History')}
      >
        <History size={16} />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
          {t('formHistoryTooltip', 'Form History')}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </button>

     <ModalComponent isOpen={isModalOpen && !selectedFormId} onClose={closeModal} >
  <div className="p-6 max-h-[80vh] overflow-y-auto">
    {!isLoading && (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {t('formHistoryForClient', 'Form History for')} {clientName}
        </h2>
        <div className="flex items-center gap-4">
          <EmergencyAlertButton
            clientId={clientId}
          />
          <div className="relative">
            {userRole === "Personnel Admin" && (
              <>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  {t('exportButton', 'Export')}
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => exportForms('pdf')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-gray-700 flex items-center gap-2"
                    >
                      <span className="text-red-500 font-medium">PDF</span>
                      {t('exportAsPdf', 'Export as PDF')}
                    </button>
                    <button
                      onClick={() => exportForms('excel')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                    >
                      <span className="text-green-500 font-medium">Excel</span>
                      {t('exportAsExcel', 'Export as Excel')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )}

    {isLoading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('loadingFormHistory', 'Loading form history...')}</p>
      </div>
    ) : error ? (
      <div className="text-center py-8 text-red-600">
        {t('errorLoadingFormHistory', 'Error loading form history:')} {(error as Error).message}
      </div>
    ) : forms.length === 0 ? (
      <div className="text-center py-8 text-gray-600">
        {t('noFormsFoundForClient', 'No forms found for this client.')}
      </div>
    ) : (
      <div className="space-y-6">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {t('formTitleColumn', 'Form Title')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {t('serviceColumn', 'Service')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {t('personnelColumn', 'Personnel')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {t('createdDateColumn', 'Created Date')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {t('actionsColumn', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, index) => (
                <tr
                  key={form._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b border-gray-200 last:border-b-0 hover:bg-gray-100`}
                >
                  <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatFormTitle(form.title)}
                  </td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${serviceColors[form.service as keyof typeof serviceColors] ||
                        "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {form.service}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                    {getPersonnelName(form)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatDate(form.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    <button
                      onClick={() => openFormDetails(form._id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      title={t('viewFormDetailsTooltip', 'View Form Details')}
                    >
                      {t('viewDetailsButton', 'View Details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>{t('totalFormsLabel', 'Total Forms:')}</strong> {totalCount} {t('formsFound', 'forms found')}
          </p>
        </div>
      </div>
    )}
  </div>
</ModalComponent>

      <ModalComponent isOpen={!!selectedFormId} onClose={closeFormDetails}>
        {isFormLoading ? (
          <div className="p-6 flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">{t('loadingFormDetails', 'Loading form details...')}</span>
          </div>
        ) : selectedForm ? ( // CHANGED: Check selectedForm directly
          <FormDetailsContent form={selectedForm} />
        ) : (
          <div className="p-6 text-center text-red-600">
            {t('failedToLoadFormDetails', 'Failed to load form details')}
          </div>
        )}
      </ModalComponent>
    </>
  );
};

interface FormDetailsContentProps {
  form: Form;
}

const FormDetailsContent: React.FC<FormDetailsContentProps> = ({ form }) => {
  const { t } = useTranslation();
  const safeClient: Client = form.client;
  const safePersonnel: Personnel = form.personnel;

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <ContentProtectionWrapper
        disablePrint={true}
        disableScreenshot={true}
        disableRightClick={false}
        disableTextSelection={true}
        showWarning={true}
        enableAdvancedProtection={true}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {form.title?.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} {t('details', 'Details')}
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
            {t('basicInformation', 'Basic Information')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('idLabel', 'ID')}</label>
              <p className="mt-1 text-sm text-gray-900">{form._id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('serviceLabel', 'Service')}</label>
              <p className="mt-1 text-sm text-gray-900">{form.service}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('titleLabel', 'Title')}</label>
              <p className="mt-1 text-sm text-gray-900">{form.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('createdDateLabel', 'Created Date')}</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(form.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
            {t('clientInformation', 'Client Information')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('clientIdLabel', 'Client ID')}</label>
              <p className="mt-1 text-sm text-gray-900">{safeClient._id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('clientNameLabel', 'Client Name')}</label>
              <p className="mt-1 text-sm text-gray-900">
                {`${safeClient.firstName} ${safeClient.lastName}`}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('emailLabel', 'Email')}</label>
              <p className="mt-1 text-sm text-gray-900">{safeClient.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('phoneLabel', 'Phone')}</label>
              <p className="mt-1 text-sm text-gray-900">{safeClient.mobile}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('genderLabel', 'Gender')}</label>
              <p className="mt-1 text-sm text-gray-900">{safeClient.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('nationalityLabel', 'Nationality')}</label>
              <p className="mt-1 text-sm text-gray-900">{safeClient.nationality}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
            {t('personnelInformation', 'Personnel Information')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('nameLabel', 'Name')}</label>
              <p className="mt-1 text-sm text-gray-900">
                {safePersonnel.firstName} {safePersonnel.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('personnelIdLabel', 'Personnel ID')}</label>
              <p className="mt-1 text-sm text-gray-900">{safePersonnel._id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('emailLabel', 'Email')}</label>
              <p className="mt-1 text-sm text-gray-900">{safePersonnel.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('roleLabel', 'Role')}</label>
              <p className="mt-1 text-sm text-gray-900">{safePersonnel.role}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
            {t('notesLabel', 'Notes')}
          </h3>
          <FormDetailsMapper form={form} formType={form.title || ""} />
        </div>
      </ContentProtectionWrapper>
    </div>
  );
};