import React from 'react';

interface EmergencyAlertStatusProps {
  status: boolean;
  reason?: string;
}
export const EmergencyAlertStatus: React.FC<EmergencyAlertStatusProps> = ({
  status,
  reason
}) => {
  if (!status) {
    return null;
  }
  return (
    <div>
      <p className="text-sm text-gray-600">Emergency Alert</p>
      <div className="flex">
        <div className="flex-1">
          <p className="text-red-800 font-medium">Emergency</p>
          {reason && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Reason Emergency</p>
              <p className="text-gray-800 font-medium">{reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};