import { Button, Card, CardBody, CardFooter, Heading, IconButton, Image, Stack, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FaArrowRight, FaTrash } from 'react-icons/fa6';
import { Link } from '@tanstack/react-router';

import { useProjectList, useWebasystApplicationList } from '@lib/state';
import { Project } from '@lib/models/project';
import { projectRoute } from '../../../../routes';

export function ProjectCard({ project }: { project: Project }) {
  const toast = useToast();
  const { deleteProject } = useProjectList();

  const { refetch: refetchWebasystApplicationList } = useWebasystApplicationList();

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

  return (
    <Card
      shadow="xs"
      bg="grey.50"
      _dark={{ bg: 'ebony.500' }}
    >
      <CardBody>
        <Image
          src={project.preview_image_url}
          fallbackSrc="https://via.placeholder.com/300x300.png"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          mx="auto"
        />
        <Stack mt="4">
          <Heading
            as="span"
            size="sm"
          >
            {project.name}
          </Heading>
        </Stack>
      </CardBody>
      <CardFooter pt={0}>
        <IconButton
          aria-label=""
          variant="link"
          colorScheme="scarlet"
          onClick={handleDeleteProject}
          icon={<FaTrash />}
        />
        <Button
          as={Link}
          to={projectRoute.to}
          params={{ projectId: project.id }}
          variant="link"
          colorScheme="dodger"
          ml="auto !important"
          rightIcon={<FaArrowRight />}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
