import { Box, ChakraProps, Flex, Heading, Image, Link, useColorModeValue, useTheme } from '@chakra-ui/react';
import { FaBrush, FaHouse, FaImages, FaPlug, FaScrewdriverWrench } from 'react-icons/fa6';
import { BsGridFill } from 'react-icons/bs';
import { PropsWithChildren } from 'react';
import { LinkProps, Link as RouterLink } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { dashboardRoute, mediaRoute, pluginsRoute, projectListRoute, settingsRoute, themesRoute } from '../../routes';
import { GreetingSection } from '@ui/atomic/molecules/GreetingSection';
import { ContactsSection } from '@ui/atomic/molecules/ContactsSection';
import { appPath } from '@lib/utils.tsx';
import { hexOpacity } from '@ui/theme/utils';

function SidebarLink(props: PropsWithChildren<ChakraProps & LinkProps>) {
  const theme = useTheme();
  const color = useColorModeValue('grey.700', 'grey.300');
  const iconColor = useColorModeValue('grey.300', 'grey.700');
  const activeColor = useColorModeValue('grey.900', 'grey.50');
  const activeBgColor = useColorModeValue('grey.50', hexOpacity(theme.colors.ebony[400], 0.3));
  const hoverBgColor = useColorModeValue(
    hexOpacity(theme.colors.grey[50], 0.6),
    hexOpacity(theme.colors.ebony[400], 0.2)
  );

  const { to } = props;

  const hoverStyle = {
    color,
    background: hoverBgColor,
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
      px="20px"
      py={2}
      fontWeight="600"
      color={color}
      bg="transparent"
      transition="background 0.1s ease, color 0.1s ease"
      _hover={hoverStyle}
      sx={{
        '&.active': activeStyle,
        '&.active > svg': { color: activeColor },
        '& > svg': { color: iconColor },
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
      borderRight="1px solid"
      borderColor="grey.50"
      _dark={{ borderColor: 'ebony.500' }}
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
        <Flex
          justify="space-between"
          align="center"
          gap="12px"
        >
          <Heading
            size="md"
            mb={0}
          >
            WebKit
          </Heading>
          <Box
            as="span"
            width="max-content"
            px="6px"
            py="1px"
            borderRadius="12px"
            bgColor="dodger.600"
            color="grey.50"
            fontSize="11px"
            fontWeight="600"
          >
            Alpha v0.1
          </Box>
        </Flex>
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
        // gap="14px"
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
          to={pluginsRoute.to}
          params={{}}
          activeOptions={{ exact: true }}
        >
          <FaPlug size={18} />
          {t('Plugins')}
        </SidebarLink>
        <SidebarLink
          to={themesRoute.to}
          params={{}}
          activeOptions={{ exact: true }}
        >
          <FaBrush size={18} />
          {t('Themes')}
        </SidebarLink>
      </Flex>
      <Flex
        direction="column"
        mt="auto"
      >
        <SidebarLink
          to={mediaRoute.to}
          params={{}}
          opacity="0.5"
        >
          <FaImages size={18} />
          {t('Media Files')}
        </SidebarLink>
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
