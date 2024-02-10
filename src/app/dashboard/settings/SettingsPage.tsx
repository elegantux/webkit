import { Container } from '@chakra-ui/react';

import { PageHeading } from '@app/dashboard/components/PageComponents';

export function SettingsPage() {
  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
      <PageHeading>Settings Page</PageHeading>
    </Container>
  );
}
