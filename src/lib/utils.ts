import { WA_APP_PATH, WA_APP_URL } from './constants';

/**
 * This helper returns a new concatenated string with the application's URL.
 * @param route
 * @returns {string}
 */
export const appUrl = (route: string) => WA_APP_URL + route;

/**
 * This helper returns a new concatenated string with the application's Path.
 * @param route
 * @returns {string}
 */
export const appPath = (route: string) => WA_APP_PATH + route;

export const getCsrf = (): string => {
  const matches = document.cookie.match(/(?:^|; )_csrf=([^;]*)/);
  if (matches && matches[1]) {
    return decodeURIComponent(matches[1]);
  }
  return '';
};

export const createFormData = (): FormData => {
  const formData = new FormData();
  formData.append('_csrf', getCsrf());
  return formData;
};
