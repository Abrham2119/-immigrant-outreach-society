export const EXCEPTION_TYPES = {
  booked: {
    label: 'Booked',
    color: 'bg-blue-100 text-blue-800'
  },
  leave: {
    label: 'Leave',
    color: 'bg-yellow-100 text-yellow-800'
  },
  holiday: {
    label: 'Holiday',
    color: 'bg-purple-100 text-purple-800'
  }
} as const;

export const EXCEPTION_STATUS = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800'
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800'
  }
} as const;

export const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'leave', label: 'Leave' },
  { value: 'holiday', label: 'Holiday' }
];

export const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];