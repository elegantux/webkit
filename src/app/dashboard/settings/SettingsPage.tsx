import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ContentSection, PageHeading } from '@app/dashboard/components/PageComponents';
import { PageContainer } from '@ui/atomic/templates/PageContainer';

export function SettingsPage() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <PageHeading>{t('Settings')}</PageHeading>
      <ContentSection>
        <Text>{t('This page is under construction')}.</Text>
      </ContentSection>
    </PageContainer>
  );
}
