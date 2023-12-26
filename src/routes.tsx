/* eslint-disable prettier/prettier */
// Package modules
import { createBrowserRouter } from 'react-router-dom';

import { Root } from './__root';
import App from './App';
import ErrorPage from './__error';
import { appUrl } from '@lib/utils';

export const router = createBrowserRouter([
  {
    path: appUrl('/'),
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: appUrl('/'),
        element: <App />
      },
      {
        path: appUrl('/about'),
        element: <h1>About page</h1>
      },
      {
        path: appUrl('/dashboard'),
        element: <h1>Dashboard page</h1>
      }
    ],
  }
]);
