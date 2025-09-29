// components/forms/FormDetails.tsx
"use client";
import { useFormManagement } from '@/domain/use-cases/form';

interface FormDetailsProps {
  id: string;
}

export const FormDetails: React.FC<FormDetailsProps> = ({ id }) => {
  const { useForm } = useFormManagement();
  const { data, isLoading, error } = useForm(id);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading form details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading form details: {error.message}
      </div>
    );
  }

  if (!data?.forms || data.forms.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        Form not found.
      </div>
    );
  }

  const form = data.forms[0];

  // Function to format form data for display
  const formatFormData = (formData: Record<string, any>) => {
    return Object.entries(formData).map(([key, value]) => {
      // Skip personnel and client name since they're displayed separately
      if (key === 'data_entry_personnel_full_name' || key === 'client_name') {
        return null;
      }

      let displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      let displayValue = value;

      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else if (typeof value === 'object' && value !== null) {
        displayValue = JSON.stringify(value);
      } else if (value === null || value === undefined) {
        displayValue = 'N/A';
      }

      return { key: displayKey, value: displayValue };
    }).filter(item => item !== null);
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Details</h2>
      
      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Form ID</label>
            <p className="mt-1 text-sm text-gray-900">{form._id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Service</label>
            <p className="mt-1 text-sm text-gray-900">{form.service}</p>
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
          <div>
            <label className="text-sm font-medium text-gray-600">Last Updated</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(form.updatedAt).toLocaleDateString('en-US', {
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
            <p className="mt-1 text-sm text-gray-900">{form.client}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Client Name</label>
            <p className="mt-1 text-sm text-gray-900">
              {form.formData.client_name || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Personnel Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Personnel Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.personnel && typeof form.personnel === 'object' ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {form.personnel.firstName} {form.personnel.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Personnel ID</label>
                <p className="mt-1 text-sm text-gray-900">{form.personnel._id}</p>
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

      {/* Form Data */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-200">
          Form Data
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formatFormData(form.formData).map((item, index) => (
              <div key={index} className="break-words">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  {item.key}
                </label>
                <p className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-300">
                  {item.value || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};