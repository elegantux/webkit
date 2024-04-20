import { Box, ChakraProps, Flex, Heading, Image, Link, useColorModeValue } from '@chakra-ui/react';
import { FaHouse, FaImages, FaScrewdriverWrench } from 'react-icons/fa6';
import { BsGridFill } from 'react-icons/bs';
import { PropsWithChildren } from 'react';
import { LinkProps, Link as RouterLink } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { dashboardRoute, mediaRoute, projectListRoute, settingsRoute } from '../../routes';
import { GreetingSection } from '@ui/atomic/molecules/GreetingSection';
import { ContactsSection } from '@ui/atomic/molecules/ContactsSection';
import { appPath } from '@lib/utils.tsx';

function SidebarLink(props: PropsWithChildren<ChakraProps & LinkProps>) {
  const activeColor = useColorModeValue('dodger.600', 'dodger.200');
  const activeBgColor = useColorModeValue('grey.50', 'ebony.600');

  const { to } = props;

  const hoverStyle = {
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
  const { t } = useTranslation();

  return (
    <Flex
      direction="column"
      py={6}
      height="full"
    >
      <Flex
        alignItems="center"
        gap="14px"
        px={3}
        width="full"
      >
        <Image
          src={appPath('/img/webkit.png')}
          width="32px"
        />
        <Heading size="sm">WebKit</Heading>
      </Flex>
      <Box
        width="100%"
        height="1px"
        bgColor="grey.50"
        my="24px"
        _dark={{
          bgColor: 'ebony.600',
        }}
      />
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
          {t('Dashboard')}
        </SidebarLink>
        <SidebarLink
          to={projectListRoute.to}
          params={{}}
        >
          <BsGridFill size={18} />
          {t('Projects')}
        </SidebarLink>
        <SidebarLink
          to={mediaRoute.to}
          params={{}}
          opacity="0.5"
        >
          <FaImages size={18} />
          {t('Media Files')}
        </SidebarLink>
      </Flex>
      <Flex
        direction="column"
        mt="auto"
      >
        <SidebarLink
          to={settingsRoute.to}
          params={{}}
          mb="24px"
          opacity="0.5"
        >
          <FaScrewdriverWrench size={18} />
          {t('Settings')}
        </SidebarLink>
        <GreetingSection
          mx="12px"
          padding="14px 14px"
        />
        <ContactsSection
          mt="8px"
          mx="12px"
          padding="14px 14px"
        />
      </Flex>
    </Flex>
  );
}
