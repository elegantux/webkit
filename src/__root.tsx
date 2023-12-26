// Package modules
import { Suspense } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Local
import { AppLayout } from '@ui/atomic/templates/AppLayout';
import theme from '@ui/theme/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      // suspense: true,
    },
  },
});

export function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Suspense fallback={<h1>Root suspense...</h1>}>
          <AppLayout />
        </Suspense>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
