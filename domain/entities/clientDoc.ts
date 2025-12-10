export interface ClientFile {
  _id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  size?: number; 
  uploadedAt: string;
}

export interface UploadableFile {
  file: File;
  previewUrl?: string;
}

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  services: string[];
  status: string;
  files?: ClientFile[];
  // ... other existing fields
}