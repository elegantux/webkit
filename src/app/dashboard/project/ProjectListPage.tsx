import { Container, Grid, GridItem } from '@chakra-ui/react';

import { useProjectList } from '@lib/state';
import { ProjectCard } from '@app/dashboard/project/components/ProjectCard';
import { PageHeading } from '@app/dashboard/components/PageComponents';

export function ProjectListPage() {
  const { projectList } = useProjectList();

  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
      <PageHeading>Project List</PageHeading>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        {projectList.length === 0 && 'No projects'}
        {projectList.map((project) => (
          <GridItem key={project.id}>
            <ProjectCard project={project} />
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
}
