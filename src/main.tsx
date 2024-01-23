import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ColorModeScript } from '@chakra-ui/react';

import theme from '@ui/theme/theme';
import { APP_ROOT_ELEMENT_ID } from '@lib/constants';
import { router } from './routes';

ReactDOM.createRoot(document.getElementById(APP_ROOT_ELEMENT_ID)!).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <RouterProvider router={router} />
  </>
);
