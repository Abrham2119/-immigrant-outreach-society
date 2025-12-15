import { useTranslation } from '@/components/providers/translation.provider';
import { useUpdateEmergencyAlertStatus } from '@/application/hooks/useNotification';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EmergencyAlertButtonProps {
  clientId: string
}

export const EmergencyAlertButton: React.FC<EmergencyAlertButtonProps> = ({ clientId }) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useUpdateEmergencyAlertStatus();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({ reason: '' });

  const validateForm = () => {
    const newErrors = { reason: '' };
    let isValid = true;

    if (!reason.trim()) {
      newErrors.reason = t('reasonRequiredMessage', 'Reason is required');
      isValid = false;
    } else if (reason.trim().length < 3) {
      newErrors.reason = t('reasonMinLengthMessage', 'Reason must be at least 3 characters');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setReason('');
    setErrors({ reason: '' });
  };

  const handleCloseModal = () => {
    if (!isPending) {
      setShowModal(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    mutate({
      clientId,
      emergency_alert: true,
      reason: reason.trim()
    }, {
      onSuccess: () => {
        toast.success(t('emergencyAlertActivatedSuccess', 'Emergency alert activated successfully!'), {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        setReason('');
      },
      onError: (error) => {
        toast.error(t('failedToActivateEmergencyAlert', 'Failed to activate emergency alert:') + ' ' + error.message, {
          position: "top-right",
          autoClose: 5000,
        });
      },
    });
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
      >
        {t('emergencyAlertButton', 'Emergency Alert')}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('activateEmergencyAlertTitle', 'Activate Emergency Alert')}
              </h3>

              <div className="mb-4">
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (errors.reason) {
                      setErrors({ reason: '' });
                    }
                  }}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.reason ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder={t('enterReasonForEmergencyAlertPlaceholder', 'Enter the reason for activating the emergency alert...')}
                  disabled={isPending}
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {t('provideClearReasonForEmergencyAlert', 'Please provide a clear reason for activating the emergency alert. Minimum 3 characters.')}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  {t('cancelButton', 'Cancel')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {t('activatingButton', 'Activating...')}
                    </>
                  ) : (
                    t('activateAlertButton', 'Activate Alert')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};