export interface AxiosErrorResponse {
  code: string;
  message: string;
  name: string;
  config: {
    transitional: object;
    adapter: any[];
    transformRequest: any[];
    transformResponse: any[];
    timeout: number;
  };
  request: XMLHttpRequest;
  response: {
    data: {
      code: number;
      message: string;
      type: string;
    };
    headers: {
      "content-length": string;
      "content-type": string;
    };
    request: XMLHttpRequest;
    status: number;
    statusText: string;
  };
  stack: string;
}
  