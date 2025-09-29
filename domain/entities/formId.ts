interface FormResponseId{
  success: boolean;
  count: number;
  forms: Form[];
}

interface Form {
  _id: string;
  client: string;
  personnel: Personnel | string;
  service: string;
  formData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Personnel {
  _id: string;
  firstName: string;
  lastName: string;
}