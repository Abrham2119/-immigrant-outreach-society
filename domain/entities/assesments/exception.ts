export interface Personnel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Exception {
  _id: string;
  personnel: Personnel;
  date: string;
  type: 'booked' | 'leave' | 'holiday';
  startTime?: string;
  endTime?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appointmentId?: string;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ExceptionsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  exceptions: Exception[];
  meta?: {
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StatusUpdateRequest {
  status: 'approved' | 'rejected';
  adminComment?: string;
}

export interface StatusUpdateResponse {
  message: string;
  exception: Exception;
}