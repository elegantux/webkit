import { RefObject, useEffect, useState } from 'react';

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

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
export const debounce = (func: Function, wait: number) => {
  let timeout: number | undefined;

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return function executedFunction(...args: any) {
    // The callback function to be executed after
    // the debounce time has elapsed
    const later = async () => {
      // null timeout to indicate the debounce ended
      timeout = undefined;

      // Execute the callback
      await func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, wait);
  };
};

/**
 * This hook monitors the appearance of the page element in the screen scope.
 * @param trackedNode
 * @return {{item: null, visited: boolean, isIntersection: boolean}}
 */
export const useIntersected = (trackedNode: RefObject<any>, observerOptions = {}) => {
  const [intersected, setIntersected] = useState<{
    isIntersection: boolean;
    visited: boolean;
    item: IntersectionObserverEntry | null;
  }>({
    isIntersection: false,
    visited: false,
    item: null,
  });

  const observer = new IntersectionObserver(([item]) => {
    if (item.isIntersecting && !intersected.isIntersection) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: true, visited: true, item }));
    } else if (!item.isIntersecting && intersected.isIntersection) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: false, item }));
    } else if (item.isIntersecting && intersected.isIntersection && !intersected.visited) {
      setIntersected((prevState) => ({ ...prevState, isIntersection: true, visited: true, item }));
    }
  }, observerOptions);

  useEffect(() => {
    const { current = null } = trackedNode;
    if (!current) return;
    observer.observe(current);

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  });

  return intersected;
};
