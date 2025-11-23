import api from './axios';

export interface ConsentFormResponse {
  message: string;
  consentForm: {
    client: string;
    personnel: string;
    service: string;
    title: string;
    formData: {
      data_entry_personnel_name: string;
      consent: boolean;
      client_signature: string;
      client_full_name: string;
      client_date: string;
      ios_staff_signature: string;
      ios_staff_full_name: string;
      ios_staff_date: string;
    };
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export const getConsentByClientId = async (clientId: string): Promise<ConsentFormResponse> => {
  const { data } = await api.get<ConsentFormResponse>(`/consent/client/${clientId}`);
  return data;
};