export interface NotificationResponse {
  success: boolean;
  message: string;
  meta?: {
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  data: Notification[];
}

export interface Notification {
  _id?: string;
  employeeId: string;
  title?: string;
  message: string;
  type: string;
  relatedClient?: string;
  delivered: boolean;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    emergency_alert?: boolean;
    services?: string[];
  };
  employee?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export interface MarkSeenResponse {
  success: boolean;
  message: string;
}

export interface ClientAlertResponse {
  success: boolean;
  message: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    emergency_alert: boolean;
  };
}