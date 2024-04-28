import { useTranslation } from 'react-i18next';
import { Checkbox, Flex, Heading, Text } from '@chakra-ui/react';

import { projectRoute } from '../../../../routes';
import { useProject, useTemplateList } from '@lib/state';
import { ContentSection } from '@app/dashboard/components/PageComponents';
import { PROJECT_TASKS } from '@app/dashboard/lib/constants';
import { PROJECT_APP_IDS, Project } from '@lib/models/project';

function ProjectTasks({ project }: { project: Project }) {
  const { templateList } = useTemplateList(project.id);
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
        {t('Project Tasks')}:
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

export function ProjectSidebar() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);

  return <ProjectTasks project={project} />;
}
