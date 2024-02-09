import { ChakraProps, Flex, Heading, Text } from '@chakra-ui/react';

import { CreateProjectButton } from '@app/dashboard/project/components/CreateProjectButton';

export function ProjectListEmptyState(props: ChakraProps) {
  return (
    <Flex
      justify="center"
      direction="column"
      {...props}
    >
      <Heading
        as="h4"
        size="lg"
      >
        You don&apos;t have any projects yet.
      </Heading>
      <Text>Start from creating a project.</Text>
      <CreateProjectButton
        width="max-content"
        mt="12px"
      />
    </Flex>
  );
}
