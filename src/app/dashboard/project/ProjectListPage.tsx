import { Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';

import { useProjectList } from '@lib/state';
import { ProjectCard } from '@app/dashboard/project/components/ProjectCard';
import { PageHeading } from '@app/dashboard/components/PageComponents';
import { CreateProjectButton } from '@app/dashboard/project/components/CreateProjectButton';
import { PageContainer } from '@ui/atomic/templates/PageContainer';

export function ProjectListPage() {
  const { projectList, isLoading } = useProjectList();

  return (
    <PageContainer>
      <PageHeading>Project List</PageHeading>
      {isLoading && 'Loading...'}
      {!isLoading && projectList.length === 0 && (
        <Flex
          justify="center"
          direction="column"
        >
          <Heading
            as="h4"
            size="lg"
          >
            No projects found.
          </Heading>
          <Text>Start from creating a project.</Text>
          <CreateProjectButton
            width="max-content"
            mt="12px"
          />
        </Flex>
      )}
      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        gap="24px"
      >
        {projectList.map((project) => (
          <GridItem
            key={project.id}
            height="100%"
          >
            <ProjectCard project={project} />
          </GridItem>
        ))}
      </Grid>
    </PageContainer>
  );
}
