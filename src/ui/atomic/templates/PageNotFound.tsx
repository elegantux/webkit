import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Heading } from '@chakra-ui/react';

import { PageContainer } from '@ui/atomic/templates/PageContainer';
import { ContentSection } from '@app/dashboard/components/PageComponents';
import { dashboardRoute } from '../../../routes';

export function PageNotFound() {
  const { t } = useTranslation();
  return (
    <PageContainer
      mx="auto"
      width="auto"
    >
      <ContentSection bgColor="transparent">
        <Heading>404. {t('Page not found')}!</Heading>
        <Link to={dashboardRoute.to}>
          {t('Go back to')}&nbsp;{t('Dashboard')}
        </Link>
      </ContentSection>
    </PageContainer>
  );
}
