export interface BookAppointmentRequest {
  client: string;
  personnel: string;
  date: string;
  startTime: string;
  endTime: string;
  remark?: string;
}

export interface BookAppointmentResponse {
  message: string;
  data?: any;
}

export interface AvailableSpot {
  date: string;
  start: string;
  end: string;
  personnel: string;
}

export interface Exception {
  date: string;
  type: "holiday" | "personal" | "emergency";
}

export interface Appointment {
  date: string;
  startTime: string;
  endTime: string;
  client: string;
  personnel: string;
}