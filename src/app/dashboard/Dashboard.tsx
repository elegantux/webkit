import { useCallback, useEffect, useState } from 'react';
import { Box, Card, Flex, Heading, Image, Progress, Text, useToast } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa6';
import { AxiosError } from 'axios';
import { Link } from '@tanstack/react-router';

// Import Swiper styles
import 'swiper/css';

import { ContentSection, PageHeading } from '@app/dashboard/components/PageComponents';
import { Project } from '@lib/models/project';
import { api } from '@lib/api';
import { ProjectListEmptyState } from '@app/dashboard/project/components/ProjectListEmptyState';
import { SliderSkeleton, TableSkeleton } from '@ui/atomic/molecules';
import { appPath, getInfoToastObject } from '@lib/utils';
import { TEMPLATE_PROJECT_TEMPLATE_TYPES, Template } from '@lib/models/template';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { RecentTemplateListEmptyState } from '@app/dashboard/template/components/TemplateListEmptyState';
import { PageContainer } from '@ui/atomic/templates/PageContainer';
import { projectListRoute, projectRoute } from '../../routes';
import { PROJECT_TASKS } from '@app/dashboard/lib/constants';
import { useTemplateList, useWebasystApplicationList } from '@lib/state.ts';

import Ornament76 from '@assets/decorations/ornament-76.svg?react';

const FETCH_DELAY = 500;

function ProjectProgressCard({ project }: { project: Project }) {
  const { templateList } = useTemplateList(project.id);
  const { appList } = useWebasystApplicationList();

  const projectApp = appList.find((app) => app.app_id === project.app_id)!;

  const completedTasksCount = PROJECT_TASKS[project.app_id]
    .map((task) => task.check(project, templateList))
    .filter((isComplete: boolean) => isComplete).length;
  const progress = (completedTasksCount / PROJECT_TASKS[project.app_id].length) * 100;
  let progressColorScheme = 'scarlet';
  if (progress >= 50) {
    progressColorScheme = 'dodger';
  }
  if (progress === 100) {
    progressColorScheme = 'malachite';
  }

  return (
    <Card
      as={Link}
      to={projectRoute.fullPath}
      params={{ projectId: project.id }}
      search={() => ({ templateType: TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT })}
      flex={1}
      shadow="xs"
      padding="24px"
      transition="background 0.1s ease-in-out"
      bg="white"
      _dark={{
        bg: 'ebony.500',
        _hover: {
          bg: 'ebony.600',
          color: 'white',
          borderColor: 'dodger.800',
        },
      }}
      border="1px solid transparent"
      borderRadius="16px"
      _hover={{
        color: 'black',
        borderColor: 'dodger.200',
      }}
    >
      <Flex
        position="relative"
        alignItems="center"
        justify="center"
        mb="14px"
      >
        <Box
          position="absolute"
          top="0px"
          left="0px"
        >
          <Image
            src={projectApp.icon}
            alt={projectApp.app_id}
            width="32px"
            flexShrink={0}
          />
        </Box>
        <Image
          src={project.preview_image_url}
          fallback={
            <Image
              src={appPath('/img/webkit.svg')}
              filter="grayscale(100%)"
              opacity="0.2"
              height="140px"
            />
          }
          alt="Project Preview Image"
          mx="auto"
          width="auto"
          w="full"
          maxH="210px"
          objectFit="cover"
          borderRadius="lg"
        />
        <Box
          position="absolute"
          top="0px"
          right="0px"
        >
          <FaArrowRight />
        </Box>
      </Flex>
      <Heading
        as="h4"
        size="lg"
      >
        {project.name}
      </Heading>
      <Box>
        <Text
          fontSize="sm"
          mb="12px"
          opacity={0.6}
        >
          {completedTasksCount}/{PROJECT_TASKS[project.app_id].length} tasks | {progress}%
        </Text>
        <Progress
          value={progress === 0 ? 5 : progress}
          colorScheme={progressColorScheme}
          size="sm"
          borderRadius="8px"
        />
      </Box>
    </Card>
  );
}

function RecentProjectList() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toast = useToast();

  const loadRecentProjectList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.project.getRecentProjectList();

      const makeDelay = response.data.length > 0;

      if (makeDelay) {
        await new Promise((r) => {
          setTimeout(r, FETCH_DELAY);
        });
      }
      setProjectList(response.data.slice(0, 3));
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
      toast(getInfoToastObject());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentProjectList();
  }, []);

  return (
    <Box my="42px">
      {isLoading && <SliderSkeleton />}
      {!isLoading && projectList.length === 0 && <ProjectListEmptyState alignItems="center" />}
      {!isLoading && projectList.length > 0 && (
        <>
          <Flex
            justify="space-between"
            align="center"
            mb="24px"
          >
            <Heading
              as="h4"
              size="md"
              mb={0}
            >
              Recent Projects
            </Heading>
            <Flex
              as={Link}
              to={projectListRoute.to}
              params={{}}
              alignItems="center"
              gap="8px"
            >
              See all
              <FaArrowRight />
            </Flex>
          </Flex>
          <Flex gap="32px">
            {projectList.map((project) => (
              <ProjectProgressCard
                key={project.id}
                project={project}
              />
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
}

function RecentTemplateListTable() {
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toast = useToast();

  const loadRecentTemplateList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.template.getRecentTemplateList();

      const makeDelay = response.data.length > 0;

      if (makeDelay) {
        await new Promise((r) => {
          setTimeout(r, FETCH_DELAY);
        });
      }
      setTemplateList(response.data);
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
      toast(getInfoToastObject());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentTemplateList();
  }, []);

  return (
    <>
      {isLoading && <TableSkeleton />}
      {!isLoading && templateList.length === 0 && <RecentTemplateListEmptyState alignItems="center" />}
      {!isLoading && templateList.length > 0 && (
        <>
          <Flex
            justify="space-between"
            align="center"
            mb="24px"
          >
            <Heading
              as="h4"
              size="md"
              mb={0}
            >
              Recent Templates
            </Heading>
          </Flex>
          <ContentSection>
            <TemplateListTable
              templateList={templateList}
              showActions={false}
            />
          </ContentSection>
        </>
      )}
    </>
  );
}

export function Dashboard() {
  return (
    <PageContainer>
      <PageHeading>Dashboard</PageHeading>
      {/* <RecentProjectListSlider /> */}
      <RecentProjectList />
      <Flex
        my="32px"
        opacity="1"
        color="grey.100"
        _dark={{ color: 'ebony.700' }}
        justify="flex-end"
        width="180px"
        height="50px"
        ml="auto"
      >
        <Ornament76 />
      </Flex>
      <RecentTemplateListTable />
    </PageContainer>
  );
}
