import { MouseEvent, Suspense, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useOutsideClick,
  useToast,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FaEllipsis, FaRegPenToSquare, FaRegTrashCan, FaTriangleExclamation } from 'react-icons/fa6';
import { Link } from '@tanstack/react-router';

import { useProjectList, useWebasystApplicationList } from '@lib/state';
import { Project } from '@lib/models/project';
import { appPath } from '@lib/utils';
import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { projectRoute } from '../../../../routes';
import { FormSkeleton } from '@ui/atomic/molecules';
import { UpsertProjectForm } from '@app/dashboard/project/components/UpsertProjectForm';

export function ProjectCard({ project, showMenu = true }: { project: Project; showMenu?: boolean }) {
  const toast = useToast();
  const menu = useDisclosure();
  const modal = useModal();
  const deleteModal = useDisclosure();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick({ ref: menuButtonRef, handler: menu.onClose });

  const { deleteProject } = useProjectList();
  const { appList, refetch: refetchWebasystApplicationList } = useWebasystApplicationList();
  const appIconUrl = appList.find((app) => app.app_id === project.app_id)?.icon ?? '';

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id);
      refetchWebasystApplicationList();
      toast({
        title: 'Project deleted successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
    }
  };

  const handleMenuButtonClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    menu.onOpen();
  };

  return (
    <>
      <Modal
        title="Delete Project"
        onPrimaryButtonClick={handleDeleteProject}
        primaryButtonLabel="Delete"
        showSecondaryButton={false}
        primaryButtonColorScheme="scarlet"
        isCentered
        {...deleteModal}
      >
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="24px"
          mt={4}
        >
          <Text color="scarlet.200">
            <FaTriangleExclamation size={42} />
          </Text>
          <Heading
            as="h5"
            size="md"
            textAlign="center"
            color="grey.900"
            _dark={{ color: 'grey.300' }}
          >
            By deleting this project, you will lose all templates and assets used in this project.
          </Heading>
          <Text>Are you sure?</Text>
        </Flex>
      </Modal>
      <ModalProvider {...modal}>
        <Modal
          title="Edit Project"
          showSecondaryButton={false}
          primaryButtonLabel="Save"
          isCentered
          {...modal.modalProps}
          {...modal.modalDisclosure}
        >
          <Suspense fallback={<FormSkeleton />}>
            <UpsertProjectForm project={project} />
          </Suspense>
        </Modal>
      </ModalProvider>
      <Card
        height="100%"
        shadow="xs"
        transition="background 0.1s ease-in-out"
        bg="grey.50"
        _dark={{ bg: 'ebony.500' }}
      >
        <CardBody
          display="flex"
          flexDirection="column"
        >
          <Flex
            justify="center"
            align="center"
            minH="180px"
            mb={4}
          >
            <Image
              src={project.preview_image_url}
              fallbackSrc={appPath('/img/webkit.svg')}
              filter={project.preview_image_url.length > 0 ? 'grayscale(0%)' : 'grayscale(100%)'}
              alt="Green double couch with wooden legs"
              width="auto"
              maxW="180px"
              objectFit="cover"
              borderRadius="lg"
              opacity={project.preview_image_url.length > 0 ? 1 : 0.2}
            />
          </Flex>
          <Flex
            mt="auto"
            justify="space-between"
            gap={1}
          >
            <Flex
              gap="8px"
              alignItems="flex-end"
            >
              <Image
                src={appIconUrl}
                alt={project.app_id}
                width="24px"
                height="auto"
                flexShrink={0}
              />
              <Heading
                as="span"
                size="sm"
                lineHeight={1.5}
              >
                {project.name}
              </Heading>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter
          pt={0}
          justify="space-between"
          alignItems="center"
        >
          <Button
            as={Link}
            to={projectRoute.to}
            params={{ projectId: project.id }}
            size="md"
            variant="outline"
            colorScheme="dodger"
          >
            View Project
          </Button>
          {showMenu && (
            <Box>
              <Menu
                isOpen={menu.isOpen}
                placement="top-end"
              >
                <MenuButton
                  ref={menuButtonRef}
                  as={IconButton}
                  size="sm"
                  aria-label="Options"
                  icon={<FaEllipsis size={20} />}
                  variant="outline"
                  colorScheme="grey"
                  borderRadius="full"
                  mr={0}
                  flexShrink={0}
                  onClick={handleMenuButtonClick}
                />
                <MenuList
                  minW="130px"
                  p={2}
                >
                  <MenuItem
                    as={Button}
                    variant="ghost"
                    colorScheme="grey"
                    size="sm"
                    icon={<FaRegPenToSquare size={14} />}
                    onClick={modal.modalDisclosure.onOpen}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    as={Button}
                    variant="ghost"
                    colorScheme="grey"
                    size="sm"
                    icon={<FaRegTrashCan size={14} />}
                    onClick={deleteModal.onOpen}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
