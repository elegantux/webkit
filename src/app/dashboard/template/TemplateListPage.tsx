import { Container } from '@chakra-ui/react';
import { Suspense } from 'react';

import { PageHeading } from '@app/dashboard/components/PageComponents';
import { useTemplateList } from '@lib/state';
import { projectRoute } from '../../../routes';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { AppLoadingState } from '@ui/atomic/templates/AppLoadingState';

export function TemplateList() {
  const { projectId } = projectRoute.useParams();
  const { templateList } = useTemplateList(projectId!);

  return <TemplateListTable templateList={templateList} />;
}

export function TemplateListPage() {
  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
      <PageHeading>Project Template List</PageHeading>
      <Suspense
        fallback={
          <AppLoadingState
            height="auto"
            mt="200px"
          />
        }
      >
        <TemplateList />
      </Suspense>
    </Container>
  );
}
