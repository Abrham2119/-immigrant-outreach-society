export type ClientStatus = "in_progress" | "approved" | "rejected" | "completed"|"arrived"
export type CaseType = "medical" | "legal" | "social" | "community" | "special";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  caseType: CaseType;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
//   documents?: Document[];
}

// export interface Document {
//   _id: string;
//   name: string;
//   type: string;
//   url: string;
//   status: "pending" | "approved" | "rejected";
//   reason?: string;
// }

export interface ClientListResponse {
  data: Client[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  caseType: CaseType;
  documents?: CreateDocumentRequest[];
}

export interface UpdateClientRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: Gender;
  caseType?: CaseType;
  status?: ClientStatus;
}

export interface CreateDocumentRequest {
  name: string;
  type: string;
  file: File;
}