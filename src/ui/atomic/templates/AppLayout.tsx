import { useEffect } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Flex, Link, useColorMode } from '@chakra-ui/react';

import { appUrl } from '@lib/utils';
import { WA_THEME_MODE_CHANGE_EVENT_NAME } from '@lib/constants';

function Navbar() {
  return (
    <Flex gap="24px">
      <Link
        as={RouterLink}
        to="/dashboard"
      >
        Home
      </Link>
      <Link
        as={RouterLink}
        to="/dashboard/about"
      >
        About
      </Link>
      <Link href={appUrl('/app/editor/2')}>Editor</Link>
    </Flex>
  );
}

export function AppLayout() {
  const { setColorMode } = useColorMode();

  const handleColorModeChange = () =>
    setColorMode(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.addEventListener(WA_THEME_MODE_CHANGE_EVENT_NAME, handleColorModeChange);
    return () => document.documentElement.removeEventListener(WA_THEME_MODE_CHANGE_EVENT_NAME, handleColorModeChange);
  }, [handleColorModeChange]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
