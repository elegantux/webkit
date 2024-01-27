import { Container } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { PageHeading } from '@app/dashboard/components/PageComponents';
import { useTemplateList } from '@lib/state';

export function TemplateListPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { templateList } = useTemplateList(projectId!);

  console.log('params', projectId);
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
