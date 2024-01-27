import { Box, Button, ChakraProps, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { LinkProps, NavLink as RouterLink, useLocation, useMatch } from 'react-router-dom';
import { FaHouse, FaList, FaQuestion, FaRegSquarePlus, FaScrewdriverWrench } from 'react-icons/fa6';
import { PropsWithChildren, Suspense } from 'react';

import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { UpsertProjectForm } from '@app/dashboard/project/components/UpsertProjectForm';
import { FormSkeleton } from '@ui/atomic/molecules';

function CreateProjectButton(props: ChakraProps) {
  const modal = useModal();
  return (
    <>
      <Button
        size="sm"
        py={4}
        leftIcon={<FaRegSquarePlus size={18} />}
        onClick={modal.modalDisclosure.onOpen}
        {...props}
      >
        Create Project
      </Button>
      <ModalProvider {...modal}>
        <Modal
          title="Create Project"
          isCentered
          {...modal.modalProps}
          {...modal.modalDisclosure}
        >
          <Suspense fallback={<FormSkeleton />}>
            <UpsertProjectForm />
          </Suspense>
        </Modal>
      </ModalProvider>
    </>
  );
}

function SidebarLink(props: PropsWithChildren<ChakraProps & LinkProps>) {
  const { pathname } = useLocation();
  const color = useColorModeValue('grey.800', 'grey.200');
  const activeColor = useColorModeValue('dodger.600', 'dodger.200');
  const activeBgColor = useColorModeValue('stratos.50', 'ebony.600');

  const { to } = props;
  const isMatch = useMatch(to.toString());
  const toPathName = String(to).split('?')[0];
  const match = pathname === toPathName;

  const hoverStyle = {
    bg: activeBgColor,
    color: activeColor,
  };
  const style = {
    bg: match ? activeBgColor : 'transparent',
    color: match ? activeColor : color,
  };

  return (
    <RouterLink
      to={to}
      className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
    >
      {isMatch && 'isMatch'}
      <Link
        // as={RouterLink}
        as="span"
        display="flex"
        alignItems="center"
        gap="12px"
        px={3}
        py={2}
        mx={3}
        borderRadius="lg"
        _hover={hoverStyle}
        {...style}
        {...props}
      />
    </RouterLink>
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
        <SidebarLink to="/dashboard">
          <FaHouse size={18} />
          Home
        </SidebarLink>
        <SidebarLink to="/dashboard/project-list">
          <FaList size={18} />
          Project List
        </SidebarLink>
        <SidebarLink to="/dashboard/about">
          <FaQuestion size={18} />
          About
        </SidebarLink>
        {/* <Link href={appUrl('/app/editor/2')}>Editor</Link> */}
      </Flex>
      <Flex
        direction="column"
        mt="auto"
      >
        <SidebarLink to="/dashboard/#">
          <FaScrewdriverWrench size={18} />
          Settings
        </SidebarLink>
      </Flex>
    </Flex>
  );
}
