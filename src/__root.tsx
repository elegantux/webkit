// Package modules
import { Suspense } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Local
import { AppLayout } from '@ui/atomic/templates/AppLayout';
import theme from '@ui/theme/theme';
import { AppLoadingState } from '@ui/atomic/templates/AppLoadingState';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Suspense fallback={<AppLoadingState />}>
          <AppLayout />
        </Suspense>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
