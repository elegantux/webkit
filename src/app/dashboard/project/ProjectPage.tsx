import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  useOutsideClick,
  useToast,
} from '@chakra-ui/react';
import { MouseEvent, Suspense, useRef } from 'react';
import {
  FaChevronDown,
  FaCirclePlus,
  FaRegPenToSquare,
  FaRegTrashCan,
  FaShareFromSquare,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ContentSection, PageHeading } from '@app/dashboard/components/PageComponents';
import { useProject, useProjectList, useTemplateList, useWebasystApplicationList } from '@lib/state';
import { projectRoute } from '../../../routes';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { AppLoadingState } from '@ui/atomic/templates/AppLoadingState';
import { CreateTemplateTypeButton } from '@app/dashboard/template/components/CreateTemplateButton';
import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { FormSkeleton } from '@ui/atomic/molecules';
import { UpsertProjectForm } from '@app/dashboard/project/components/UpsertProjectForm';
import { PROJECT_APP_IDS, Project } from '@lib/models/project';
import { TemplateListEmptyState } from '@app/dashboard/template/components/TemplateListEmptyState';
import { ThemeSettings } from './components/ThemeSettings';
import { PageContainer } from '@ui/atomic/templates/PageContainer';
import { TEMPLATE_PROJECT_TEMPLATE_TYPES } from '@lib/models/template';
import { PROJECT_TASKS } from '@app/dashboard/lib/constants';
import { WA_BACKEND_URL } from '@lib/constants.ts';

import Ornament82 from '@assets/decorations/ornament-82.svg?react';

function ProjectActionsButton({ project }: { project: Project }) {
  const toast = useToast();
  const menu = useDisclosure();
  const modal = useModal();
  const deleteModal = useDisclosure();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const storefrontUrl = `${window.location.protocol}//${project?.settlement?.settlement?.replace('*', '')}`;

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
            width="24px"
            minW="24px"
            height="24px"
            aria-label="Options"
            icon={<FaChevronDown size={16} />}
            variant="outline"
            colorScheme="grey"
            borderRadius="full"
            border="none"
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
              {t('Edit')}
            </MenuItem>
            {project.settlement ? (
              <MenuItem
                variant="ghost"
                size="sm"
                colorScheme="grey"
                as={Link}
                href={storefrontUrl}
                target="_blank"
                icon={<FaShareFromSquare size={14} />}
                borderRadius="8px"
                fontSize="14px"
                fontWeight="600"
                textDecoration="none"
                height="32px"
              >
                {t('Storefront')}
              </MenuItem>
            ) : (
              <MenuItem
                variant="ghost"
                size="sm"
                colorScheme="grey"
                as={Link}
                href={`${WA_BACKEND_URL}/site/#/routing/`}
                icon={<FaShareFromSquare size={14} />}
                borderRadius="8px"
                fontSize="14px"
                fontWeight="600"
                textDecoration="none"
                height="32px"
              >
                {t('Attach to settlement')}
              </MenuItem>
            )}
            <MenuItem
              as={Button}
              variant="ghost"
              colorScheme="grey"
              size="sm"
              icon={<FaRegTrashCan size={14} />}
              onClick={deleteModal.onOpen}
            >
              {t('Delete')}
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Modal
        title={t('Delete Project')}
        onPrimaryButtonClick={handleDeleteProject}
        primaryButtonLabel={t('Delete')}
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
            {t('By deleting this project, you will lose all templates and assets used in this project')}.
          </Heading>
          <Text>{t('Are you sure')}?</Text>
        </Flex>
      </Modal>
      <ModalProvider {...modal}>
        <Modal
          title={t('Edit Project')}
          showSecondaryButton={false}
          primaryButtonLabel={t('Save')}
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

export function TemplateList({ templateType }: { templateType: TEMPLATE_PROJECT_TEMPLATE_TYPES | undefined }) {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);
  const { templateList } = useTemplateList(projectId!, { template_type: templateType });
  const { appList } = useWebasystApplicationList();

  if (appList.length === 0) {
    return null;
  }

  return templateList.length === 0 ? (
    <TemplateListEmptyState
      showCTA={templateType === TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT}
      justifyContent="center"
      alignItems="center"
      mt="62px"
    />
  ) : (
    <ContentSection>
      <TemplateListTable
        templateList={templateList}
        project={project}
      />
    </ContentSection>
  );
}

export function ProjectPageHeader() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);
  const { appList } = useWebasystApplicationList();
  const { t } = useTranslation();

  const projectApp = appList.find((app) => app.app_id === project.app_id)!;

  if (appList.length === 0) {
    return null;
  }

  return (
    <Flex
      justify="space-between"
      alignItems="center"
      mb={12}
    >
      <Flex
        position="relative"
        alignItems="center"
        gap="12px"
      >
        <Image
          src={projectApp.icon}
          alt={projectApp.app_id}
          width="32px"
          flexShrink={0}
        />
        <PageHeading mb={0}>{project.name}</PageHeading>
        <Text
          position="absolute"
          top="100%"
          left="46px"
          width="max-content"
          fontSize="sm"
          opacity="0.5"
        >
          Theme ID: {project.theme_id}
        </Text>
        <ProjectActionsButton project={project} />
      </Flex>
      <CreateTemplateTypeButton
        size="sm"
        py={0}
        leftIcon={<FaCirclePlus size={18} />}
      >
        {t('Create Template')}
      </CreateTemplateTypeButton>
    </Flex>
  );
}

function ProjectTasks() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);
  const { templateList } = useTemplateList(projectId!);
  const { t } = useTranslation();

  return (
    <ContentSection
      position="sticky"
      top="12px"
    >
      <Heading
        as="h5"
        size="sm"
      >
        {t('Project Tasks:')}
      </Heading>
      <Flex
        direction="column"
        gap="8px"
      >
        {PROJECT_TASKS[project.app_id as PROJECT_APP_IDS].map((task) => (
          <Flex
            key={task.title}
            alignItems="center"
            gap="8px"
          >
            <Checkbox
              colorScheme="malachite"
              size="sm"
              isChecked={task.check(project, templateList)}
            />
            <Text fontSize="sm">{task.title}</Text>
          </Flex>
        ))}
      </Flex>
    </ContentSection>
  );
}

export function ProjectPage() {
  const { projectId } = projectRoute.useParams();
  const { templateType } = projectRoute.useSearch();
  const navigate = useNavigate({ from: projectRoute.fullPath });
  const { t } = useTranslation();

  const activeColor = useColorModeValue('dodger.500', 'dodger.200');

  return (
    <PageContainer>
      <Grid
        gridTemplateColumns="1fr 320px"
        gap="24px"
      >
        <GridItem>
          <ProjectPageHeader />
          <Flex
            alignItems="center"
            justify="space-between"
          >
            <Flex
              gap="34px"
              alignItems="center"
            >
              <Flex gap="12px">
                <Button
                  variant="link"
                  size="sm"
                  colorScheme="grey"
                  gap="8px"
                  py="22px"
                  px="12px"
                  borderBottomWidth="2px"
                  borderRadius="12px 12px 0 0"
                  onClick={() =>
                    navigate({
                      params: { projectId },
                      search: () => ({ templateType: TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT }),
                    })
                  }
                  {...(templateType === TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT
                    ? {
                        color: activeColor,
                        borderBottomColor: activeColor,
                      }
                    : {})}
                >
                  {t('Theme Templates')}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  colorScheme="grey"
                  gap="8px"
                  py="22px"
                  px="12px"
                  borderBottomWidth="2px"
                  borderRadius="12px 12px 0 0"
                  onClick={() =>
                    navigate({
                      params: { projectId },
                      search: () => ({ templateType: TEMPLATE_PROJECT_TEMPLATE_TYPES.LOOP }),
                    })
                  }
                  {...(templateType === TEMPLATE_PROJECT_TEMPLATE_TYPES.LOOP
                    ? {
                        color: activeColor,
                        borderBottomColor: activeColor,
                      }
                    : {})}
                >
                  {t('Loop Templates')}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  colorScheme="grey"
                  gap="8px"
                  py="22px"
                  px="12px"
                  borderBottomWidth="2px"
                  borderRadius="12px 12px 0 0"
                  onClick={() =>
                    navigate({
                      params: { projectId },
                      search: () => ({ templateType: TEMPLATE_PROJECT_TEMPLATE_TYPES.INFO_PAGE }),
                    })
                  }
                  {...(templateType === TEMPLATE_PROJECT_TEMPLATE_TYPES.INFO_PAGE
                    ? {
                        color: activeColor,
                        borderBottomColor: activeColor,
                      }
                    : {})}
                >
                  {t('Info Pages')}
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Box
            width="100%"
            height="2px"
            bgColor="grey.100"
            mt="-2px"
            mb="24px"
            _dark={{ bgColor: 'ebony.500' }}
          />
          <Suspense
            fallback={
              <AppLoadingState
                height="auto"
                mt="200px"
              />
            }
          >
            <TemplateList templateType={templateType} />
          </Suspense>
          <Flex
            justify="flex-end"
            width="180px"
            height="50px"
            ml="auto"
            my="32px"
            opacity="1"
            color="grey.100"
            _dark={{ color: 'ebony.700' }}
          >
            <Ornament82 />
          </Flex>
          <Suspense
            fallback={
              <AppLoadingState
                height="auto"
                mt="200px"
              />
            }
          >
            <ThemeSettings />
          </Suspense>
        </GridItem>
        <GridItem>
          <Suspense
            fallback={
              <AppLoadingState
                height="auto"
                mt="200px"
              />
            }
          >
            <ProjectTasks />
          </Suspense>
        </GridItem>
      </Grid>
    </PageContainer>
  );
}
