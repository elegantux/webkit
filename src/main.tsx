import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ColorModeScript } from '@chakra-ui/react';

// eslint-disable-next-line import/extensions
import '../i18n';

import theme from '@ui/theme/theme';
import { APP_ROOT_ELEMENT_ID } from '@lib/constants';
import { appUrl } from '@lib/utils';
import { routeTree } from './routes';

const router = createRouter({ routeTree, basepath: appUrl('') });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById(APP_ROOT_ELEMENT_ID)!).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <RouterProvider router={router} />
  </>
);
