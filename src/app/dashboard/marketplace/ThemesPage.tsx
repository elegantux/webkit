import { useEffect, useRef, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEventListener } from 'usehooks-ts';

import { WA_APP_FULL_URL } from '@lib/constants.ts';

export function ThemesPage() {
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  const loadPageContent = () => {
    setLoading(true);
    $(ref.current!).load(`${WA_APP_FULL_URL}?module=design`, () => {
      setLoading(false);
    });
  };

  const handleNavigationChange = () => {
    loadPageContent();
  };

  /**
   * There are some issues with injecting Theme page into the React page.
   * 1. Switching between Settings and Templates tabs throws an error
   * 2. On the Templates tab, on the third try templates are not loaded
   *
   * Reloading the content into the React page seems to be working, but this is not a solution, it's more like temp hack.
   */
  useEventListener('hashchange', handleNavigationChange);

  useEffect(() => {
    if (ref.current) {
      loadPageContent();
    }
  }, []);

  return (
    <Box position="relative">
      {loading && 'Loading...'}
      <Box
        ref={ref}
        display={loading ? 'none' : 'block'}
        sx={{
          '& .sidebar': {
            top: '0px',
          },
        }}
      />
      <Flex
        position="absolute"
        top={0}
        left={0}
        zIndex={loading ? 1 : -1}
        width="full"
        height="calc(100vh - 64px)"
        bgColor="grey.50"
        align="center"
        justify="center"
        opacity={loading ? 1 : 0}
        transition="all 0.3s ease-in-out"
        _dark={{
          bgColor: 'ebony.700',
        }}
      >
        <Spinner />
      </Flex>
    </Box>
  );
}
