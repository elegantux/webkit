export default class ApiError extends Error {
  sourceError: any;

  constructor(error: any) {
    super(error.error);

    this.name = 'ApiError';
    this.message = error.message || this.message;
    this.sourceError = error;
  }
}
