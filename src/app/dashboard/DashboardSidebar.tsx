import { Box, ChakraProps, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { FaHouse, FaList, FaScrewdriverWrench } from 'react-icons/fa6';
import { PropsWithChildren } from 'react';
import { LinkProps, Link as RouterLink } from '@tanstack/react-router';

import { dashboardRoute, projectListRoute, settingsRoute } from '../../routes';
import { CreateProjectButton } from '@app/dashboard/project/components/CreateProjectButton';

function SidebarLink(props: PropsWithChildren<ChakraProps & LinkProps>) {
  const activeColor = useColorModeValue('dodger.600', 'dodger.200');
  const activeBgColor = useColorModeValue('stratos.50', 'ebony.600');

  const { to } = props;

  const hoverStyle = {
    // bg: activeBgColor,
    color: activeColor,
  };
  const activeStyle = {
    background: activeBgColor,
    color: activeColor,
  };

  return (
    <Link
      as={RouterLink}
      to={to}
      activeProps={{
        className: 'active',
      }}
      display="flex"
      alignItems="center"
      gap="12px"
      px={3}
      py={2}
      mx={3}
      bg="transparent"
      transition="background 0.5s ease, color 0.2s ease"
      borderRadius="lg"
      _hover={hoverStyle}
      sx={{
        '&.active': activeStyle,
      }}
      {...props}
    />
  );
}

export function DashboardSidebar() {
  return (
    <Flex
      direction="column"
      py={6}
      height="full"
    >
      <Box
        px={3}
        mb={6}
        width="full"
      >
        <CreateProjectButton width="full" />
      </Box>
      <Flex
        direction="column"
        gap="14px"
      >
        <SidebarLink
          to={dashboardRoute.to}
          params={{}}
          activeOptions={{ exact: true }}
        >
          <FaHouse size={18} />
          Home
        </SidebarLink>
        <SidebarLink
          to={projectListRoute.to}
          params={{}}
        >
          <FaList size={18} />
          Project List
        </SidebarLink>
        {/* <SidebarLink */}
        {/*  to={dashboardRoute.to} */}
        {/*  params={{}} */}
        {/* > */}
        {/*  <FaQuestion size={18} /> */}
        {/*  About */}
        {/* </SidebarLink> */}
      </Flex>
      <Flex
        direction="column"
        mt="auto"
      >
        <SidebarLink
          to={settingsRoute.to}
          params={{}}
        >
          <FaScrewdriverWrench size={18} />
          Settings
        </SidebarLink>
      </Flex>
    </Flex>
  );
}
