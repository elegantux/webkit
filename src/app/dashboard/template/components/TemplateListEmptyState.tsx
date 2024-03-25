import { ChakraProps, Flex, Heading, Text } from '@chakra-ui/react';

import { CreateTemplateButton } from '@app/dashboard/template/components/CreateTemplateButton';

export function TemplateListEmptyState({ showCTA = true, ...props }: ChakraProps & { showCTA?: boolean }) {
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
        You don&apos;t have any templates yet.
      </Heading>
      {showCTA && (
        <>
          <Text>Start from creating a template.</Text>
          <CreateTemplateButton
            width="max-content"
            mt="12px"
          >
            Create Template
          </CreateTemplateButton>
        </>
      )}
    </Flex>
  );
}

export function RecentTemplateListEmptyState(props: ChakraProps) {
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
        You don&apos;t have any templates yet.
      </Heading>
      <Text>Go to the project page to create a template.</Text>
    </Flex>
  );
}
