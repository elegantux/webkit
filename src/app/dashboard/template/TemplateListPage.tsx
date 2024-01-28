import { Container } from '@chakra-ui/react';

import { PageHeading } from '@app/dashboard/components/PageComponents';
import { useTemplateList } from '@lib/state';
import { projectRoute } from '../../../routes';

export function TemplateListPage() {
  const { projectId } = projectRoute.useParams();
  const { templateList } = useTemplateList(projectId!);

  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
      <PageHeading>Project Template List</PageHeading>
      {templateList.map((template) => (
        <>
          <h3>{template.name}</h3>
          <span>{template.create_datetime}</span>
        </>
      ))}
    </Container>
  );
}
