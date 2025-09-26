import { AxiosErrorResponse } from "./AxiosErrorResponse";

const errorMessages: Record<number, string> = {
  401: "Unauthorized network error: Please log in.",
  403: "Forbidden access: You do not have permission.",
  404: "Resource not found: The requested resource could not be found.",
  500: "Internal server error: Please try again later.",
  429: "Too many requests: Please try again later after some time.",
};

export const getErrorMessage = ({ message }: { message?: AxiosErrorResponse }): string => {
  if (!message || !message.response) {
    return "An unknown error occurred.";
  }
  return (
    message.response.data.message ||
    message.request.statusText ||
    message.message ||
    errorMessages[message.response.status]
  );
};
