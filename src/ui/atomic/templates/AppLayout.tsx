import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Flex, Link } from '@chakra-ui/react';

//
import { appUrl } from '@lib/utils';

function Navbar() {
  return (
    <Flex gap="24px">
      <Link
        as={RouterLink}
        to={appUrl('/')}
      >
        Home
      </Link>
      <Link
        as={RouterLink}
        to={appUrl('/about')}
      >
        About
      </Link>
      <Link
        as={RouterLink}
        to={appUrl('/dashboard')}
      >
        Dashboard
      </Link>
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
