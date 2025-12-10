"use client";

import { File } from 'lucide-react';
import { ClientDocumentUpload } from './ClientDocumentUpload';


interface ClientDocumentsModalProps {
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDocumentsModal: React.FC<ClientDocumentsModalProps> = ({
  clientId,
  clientName,
  isOpen,
  onClose,
}) => {
    return (
    <div className="fixed inset-0 bg-black/50   flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Documents for {clientName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <ClientDocumentUpload
              clientId={clientId}
              clientName={clientName} 
                onClose={() => onClose()}   />
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};