import { ChakraProps, Flex, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { CreateTemplateButton } from '@app/dashboard/template/components/CreateTemplateButton';

export function TemplateListEmptyState({ showCTA = true, ...props }: ChakraProps & { showCTA?: boolean }) {
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
        {t("You don't have any templates yet")}.
      </Heading>
      {showCTA && (
        <>
          <Text>{t('Start from creating a template')}.</Text>
          <CreateTemplateButton
            width="max-content"
            mt="12px"
          >
            {t('Create Template')}
          </CreateTemplateButton>
        </>
      )}
    </Flex>
  );
}

export function RecentTemplateListEmptyState(props: ChakraProps) {
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
        {t("You don't have any templates yet")}.
      </Heading>
      <Text>{t('Go to the project page to create a template')}.</Text>
    </Flex>
  );
}
