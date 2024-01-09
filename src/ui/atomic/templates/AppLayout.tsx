import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Flex, Link } from '@chakra-ui/react';

//
import { appUrl } from '@lib/utils';

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
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
