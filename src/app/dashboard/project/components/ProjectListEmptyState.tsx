import { useTranslation } from 'react-i18next';
import { ChakraProps, Flex, Heading, Text } from '@chakra-ui/react';

import { CreateProjectButton } from '@app/dashboard/project/components/CreateProjectButton';

export function ProjectListEmptyState(props: ChakraProps) {
  const { t } = useTranslation();

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
        {t('You dont have any projects yet')}
      </Heading>
      <Text>{t('Start from creating a project')}</Text>
      <CreateProjectButton
        width="max-content"
        mt="12px"
      />
    </Flex>
  );
}
