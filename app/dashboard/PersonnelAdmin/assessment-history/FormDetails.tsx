"use client";
import { ContentProtectionWrapper } from '@/components/ContentProtectionWrapper';
import { FormDetailsMapper } from '@/components/forms/form-details/FormDetailsMapper';
import { Client, Personnel } from '@/domain/entities/formId';
import { useForm } from '@/domain/use-cases/form';

interface FormDetailsProps {
  id: string;
}

export const FormDetails: React.FC<FormDetailsProps> = ({ id }) => {
  const { data, isLoading, error } = useForm(id);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading details: {error.message}
      </div>
    );
  }

  if (!data?.form) {
    return (
      <div className="p-6 text-center text-gray-600">
        not found.
      </div>
    );
  }

  const form = data.form;

  // Safe objects to prevent null errors
  const safeClient: Client = form.client || {};
  const safePersonnel: Personnel = form.personnel || {};

  return (
     <ContentProtectionWrapper 
      disablePrint={true}
      disableScreenshot={true}
      disableRightClick={false}
      disableTextSelection={true}
      showWarning={true}
      enableAdvancedProtection={true}

    >
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {form.title?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Details
      </h2>
      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">ID</label>
            <p className="mt-1 text-sm text-gray-900">{form._id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Service</label>
            <p className="mt-1 text-sm text-gray-900">{form.service}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Title</label>
            <p className="mt-1 text-sm text-gray-900">{form.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Created Date</label>
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

      {/* Client Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Client ID</label>
            <p className="mt-1 text-sm text-gray-900">{safeClient._id || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Client Name</label>
            <p className="mt-1 text-sm text-gray-900">
              {safeClient.firstName && safeClient.lastName
                ? `${safeClient.firstName} ${safeClient.lastName}`
                : 'N/A'
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-sm text-gray-900">{safeClient.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="mt-1 text-sm text-gray-900">{safeClient.mobile || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <p className="mt-1 text-sm text-gray-900">{safeClient.gender || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Nationality</label>
            <p className="mt-1 text-sm text-gray-900">{safeClient.nationality || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Personnel Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Personnel Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safePersonnel._id ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {safePersonnel.firstName} {safePersonnel.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Personnel ID</label>
                <p className="mt-1 text-sm text-gray-900">{safePersonnel._id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-sm text-gray-900">{safePersonnel.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="mt-1 text-sm text-gray-900">{safePersonnel.role || 'N/A'}</p>
              </div>
            </>
          ) : (
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-600">Data Entry Personnel</label>
              <p className="mt-1 text-sm text-gray-900">
                {form.formData.data_entry_personnel_full_name || 'N/A'}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Notes
        </h3>
        <FormDetailsMapper form={form} formType={form.title} />
      </div>
    </div>
    </ContentProtectionWrapper>
  );
};