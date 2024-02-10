import {
  Box,
  Button,
  Container,
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
import { MouseEvent, Suspense, useRef } from 'react';
import { FaEllipsis, FaRegPenToSquare, FaRegSquarePlus, FaRegTrashCan, FaTriangleExclamation } from 'react-icons/fa6';
import { AxiosError } from 'axios/index';
import { useNavigate } from '@tanstack/react-router';

import { PageHeading } from '@app/dashboard/components/PageComponents';
import { useProject, useProjectList, useTemplateList, useWebasystApplicationList } from '@lib/state';
import { projectRoute } from '../../../routes';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { AppLoadingState } from '@ui/atomic/templates/AppLoadingState';
import { CreateTemplateButton } from '@app/dashboard/template/components/CreateTemplateButton';
import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { FormSkeleton } from '@ui/atomic/molecules';
import { UpsertProjectForm } from '@app/dashboard/project/components/UpsertProjectForm';
import { Project } from '@lib/models/project';
import { TemplateListEmptyState } from '@app/dashboard/template/components/TemplateListEmptyState';

function ProjectActionsButton({ project }: { project: Project }) {
  const toast = useToast();
  const menu = useDisclosure();
  const modal = useModal();
  const deleteModal = useDisclosure();
  const navigate = useNavigate();

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { deleteProject } = useProjectList();
  const { refetch: refetchWebasystApplicationList } = useWebasystApplicationList();

  useOutsideClick({ ref: menuButtonRef, handler: menu.onClose });

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id);
      refetchWebasystApplicationList();
      toast({
        title: 'Project deleted successfully',
        status: 'success',
        duration: 3000,
      });
      await navigate({ to: '/app/dashboard/project-list' });
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
      <Box>
        <Menu
          isOpen={menu.isOpen}
          placement="bottom-end"
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
    </>
  );
}

export function TemplateList() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);
  const { templateList } = useTemplateList(projectId!);
  const { appList } = useWebasystApplicationList();

  const projectApp = appList.find((app) => app.app_id === project.app_id)!;

  return (
    <>
      <Flex
        justify="space-between"
        alignItems="center"
        mb={12}
      >
        <Flex
          alignItems="center"
          gap="12px"
        >
          <Image
            src={projectApp.icon}
            alt={projectApp.app_id}
            width="32px"
            flexShrink={0}
          />
          <PageHeading>{project.name}</PageHeading>
        </Flex>
        <ProjectActionsButton project={project} />
      </Flex>
      {templateList.length === 0 ? (
        <TemplateListEmptyState
          justifyContent="center"
          alignItems="center"
        />
      ) : (
        <>
          <Flex
            alignItems="center"
            justify="space-between"
            mb="24px"
          >
            <Heading
              as="h4"
              size="md"
              mb={0}
            >
              Template List
            </Heading>
            <CreateTemplateButton
              size="sm"
              variant="outline"
              py={4}
              leftIcon={<FaRegSquarePlus size={18} />}
            >
              Create Template
            </CreateTemplateButton>
          </Flex>
          <TemplateListTable
            templateList={templateList}
            project={project}
          />
        </>
      )}
    </>
  );
}

export function ProjectPage() {
  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
      <Suspense
        fallback={
          <AppLoadingState
            height="auto"
            mt="200px"
          />
        }
      >
        <TemplateList />
      </Suspense>
    </Container>
  );
}
