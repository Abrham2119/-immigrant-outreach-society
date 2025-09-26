"use client";
import React from 'react';
import { Personnel } from '@/domain/entities/personnel';
import ModalComponent from '../ui/modal/Modal';
import AppointmentPage from '@/app/dashboard/receptionist/component/AppointmentPage';

interface PersonnelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnels: Personnel[];
  clientId: string;
  onPersonnelSelect: (clientId: string, personnelId: string) => void;
  isLoading?: boolean;
}

export const PersonnelSelectionModal: React.FC<PersonnelSelectionModalProps> = ({
  isOpen,
  onClose,
  personnels,
  clientId,
  onPersonnelSelect,
  isLoading = false
}) => {
  const [selectedPersonnel, setSelectedPersonnel] = React.useState<{clientId: string, personnelId: string} | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = React.useState(false);

  const handlePersonnelClick = (personnelId: string) => {
    setSelectedPersonnel({ clientId, personnelId });
    setIsAppointmentModalOpen(true);
    onClose(); // Close the personnel selection modal
  };

  const handleAppointmentModalClose = () => {
    setIsAppointmentModalOpen(false);
    setSelectedPersonnel(null);
    // Optionally call the original onPersonnelSelect callback
    if (selectedPersonnel) {
      onPersonnelSelect(selectedPersonnel.clientId, selectedPersonnel.personnelId);
    }
  };

  return (
    <>
      {/* Personnel Selection Modal */}
      <ModalComponent isOpen={isOpen} onClose={onClose}>
        <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Select Personnel</h2>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            <p className="text-gray-600 mb-4">
              Choose a personnel to book an appointment for this client.
            </p>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading personnels...</p>
              </div>
            ) : personnels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No personnels available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personnels.map((personnel) => (
                  <div
                    key={personnel._id}
                    onClick={() => handlePersonnelClick(personnel._id)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {personnel.firstName.charAt(0)}{personnel.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {personnel.firstName} {personnel.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{personnel.role}</p>
                        <p className="text-xs text-gray-500">{personnel.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalComponent>

      {/* Appointment Booking Modal */}
      <ModalComponent isOpen={isAppointmentModalOpen} onClose={handleAppointmentModalClose}>
        <div className="w-full max-w-6xl max-h-[87vh] overflow-auto">
          {selectedPersonnel && (
            <AppointmentPage 
              clientId={selectedPersonnel.clientId}
              personnelId={selectedPersonnel.personnelId}
            />
          )}
        </div>
      </ModalComponent>
    </>
  );
};