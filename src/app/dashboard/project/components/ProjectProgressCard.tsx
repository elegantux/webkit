import { Box, Card, Flex, Heading, Image, Progress, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

import { Project } from '@lib/models/project';
import { useTemplateList, useWebasystApplicationList } from '@lib/state.ts';
import { PROJECT_TASKS } from '@app/dashboard/lib/constants';
import { projectRoute } from '../../../../routes';
import { TEMPLATE_PROJECT_TEMPLATE_TYPES } from '@lib/models/template';
import { appPath } from '@lib/utils.tsx';

export function ProjectProgressCard({ project }: { project: Project }) {
  const { templateList } = useTemplateList(project.id);
  const { appList } = useWebasystApplicationList();
  const { t } = useTranslation();

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
      borderRadius="8px"
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
          {completedTasksCount}/{PROJECT_TASKS[project.app_id].length} {t('tasks')} | {progress}%
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
