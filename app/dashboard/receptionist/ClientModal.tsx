'use client';

import { Button } from '@/components/ui/Button/Button';
import { Client } from '@/domain/entities/client';
import * as z from 'zod';

const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  caseType: z.enum(['medical', 'legal', 'social', 'community', 'special']),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSubmit: (data: ClientFormData) => void;
}

export default function ClientModal({ isOpen, onClose, client, onSubmit }: ClientModalProps) {
  const isEdit = !!client;
 
  const handleSubmit = (data: ClientFormData) => {
    onSubmit(data);
  };

  const fields: any[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'phone',
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer_not_to_say', label: 'Prefer not to say' },
      ],
    },
    {
      name: 'caseType',
      label: 'Case Type',
      type: 'select',
      required: true,
      options: [
        { value: 'medical', label: 'Medical Case' },
        { value: 'legal', label: 'Legal Case' },
        { value: 'social', label: 'Social Case' },
        { value: 'community', label: 'Community Case' },
        { value: 'special', label: 'Special Case' },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
        
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}