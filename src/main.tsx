import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { APP_ROOT_ELEMENT_ID } from '@lib/constants';
import { router } from './routes';

ReactDOM.createRoot(document.getElementById(APP_ROOT_ELEMENT_ID)!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
