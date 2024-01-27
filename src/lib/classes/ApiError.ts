export default class ApiError extends Error {
  sourceError: any;

  constructor(error: any) {
    const apiErrors = error.errors;
    super(apiErrors);

    this.name = 'ApiError';
    this.message = apiErrors.message || this.message;
    this.sourceError = error;
  }
}
