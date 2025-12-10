import { ClientFile } from "@/domain/entities/clientDoc";
import api from "./axios";


export interface UploadClientFilesParams {
  clientId: string;
  files: File[];
}

export const clientDocumentsService = {
  uploadFiles: async ({ clientId, files }: UploadClientFilesParams): Promise<ClientFile[]> => {
    const formData = new FormData();
    
    // Add files to FormData - key must be "files" as raw data array
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post(`/clients/${clientId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteFile: async (clientId: string, fileId: string): Promise<void> => {
    await api.delete(`/clients/${clientId}/files/${fileId}`);
  },

  getClientFiles: async (clientId: string): Promise<ClientFile[]> => {
    const response = await api.get(`/clients/${clientId}/files`);
    return response.data;
  },
};