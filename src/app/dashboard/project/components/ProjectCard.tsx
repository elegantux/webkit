import { useRef } from 'react';
import { Card, CardBody, Flex, Heading, Image, useDisclosure, useOutsideClick } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

import { useWebasystApplicationList } from '@lib/state';
import { Project } from '@lib/models/project';
import { appPath } from '@lib/utils';
import { projectRoute } from '../../../../routes';

export function ProjectCard({ project }: { project: Project }) {
  const menu = useDisclosure();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick({ ref: menuButtonRef, handler: menu.onClose });

  const { appList } = useWebasystApplicationList();
  const appIconUrl = appList.find((app) => app.app_id === project.app_id)?.icon ?? '';

  return (
    <Card
      as={Link}
      to={projectRoute.to}
      params={{ projectId: project.id }}
      height="100%"
      shadow="xs"
      transition="background 0.1s ease-in-out"
      bg="grey.50"
      _dark={{
        bg: 'ebony.500',
        _hover: {
          bg: 'ebony.600',
          color: 'white',
          borderColor: 'ebony.400',
        },
      }}
      border="1px solid transparent"
      _hover={{
        color: 'black',
        borderColor: 'grey.100',
      }}
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
            // src="https://elementor.com/library/wp-content/uploads/2023/08/Jewelry-Shop-Home-Page.png"
            fallback={
              <Image
                src={appPath('/img/webkit.svg')}
                filter="grayscale(100%)"
                opacity="0.2"
              />
            }
            alt="Green double couch with wooden legs"
            width="auto"
            w="full"
            maxH="210px"
            objectFit="cover"
            borderRadius="lg"
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
      {/* <CardFooter */}
      {/*  pt={0} */}
      {/*  justify="space-between" */}
      {/*  alignItems="center" */}
      {/* > */}
      {/*  <Button */}
      {/*    as={Link} */}
      {/*    to={projectRoute.to} */}
      {/*    params={{ projectId: project.id }} */}
      {/*    size="md" */}
      {/*    variant="outline" */}
      {/*    colorScheme="dodger" */}
      {/*  > */}
      {/*    View Project */}
      {/*  </Button> */}
      {/* </CardFooter> */}
    </Card>
  );
}
