import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

import { HOST, WA_APP_URL } from '@lib/constants.ts';

export function PluginsPage() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      $(ref.current).load(`${HOST}${WA_APP_URL}?module=plugins`);
    }
  }, []);

  return <Box ref={ref} />;
}
