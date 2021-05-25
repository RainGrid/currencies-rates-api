import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  status: number;
  message: string;
  name = 'ApiError';

  constructor(status?: number, message?: string) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = message || getReasonPhrase(this.status) || 'Error';
  }
}

export default ApiError;
