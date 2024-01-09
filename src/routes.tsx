/* eslint-disable prettier/prettier */
// Package modules
import { createBrowserRouter } from 'react-router-dom';

import { Root } from './__root';
import App from './App';
import ErrorPage from './__error';
import { appUrl } from '@lib/utils';

const BASENAME = appUrl('/app');

export const router = createBrowserRouter([
  {
    path: 'dashboard',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <App />
      },
      {
        path: 'about',
        element: <h1>About page</h1>
      },
      {
        path: 'contact',
        element: <h1>Contact page</h1>
      },
    ],
  },
  {
    path: 'editor/:id',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <h1>Editor page</h1>,
      },
    ]
  }
], {
  basename: BASENAME,
});
