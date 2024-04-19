import { Text } from '@chakra-ui/react';

import { ContentSection, PageHeading } from '@app/dashboard/components/PageComponents';
import { PageContainer } from '@ui/atomic/templates/PageContainer';

export function SettingsPage() {
  return (
    <PageContainer>
      <PageHeading>Settings</PageHeading>
      <ContentSection>
        <Text>This page is under construction.</Text>
      </ContentSection>
    </PageContainer>
  );
}
