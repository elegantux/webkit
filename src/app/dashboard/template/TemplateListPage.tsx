import { Container, Flex, Heading, Image } from '@chakra-ui/react';
import { Suspense } from 'react';
import { FaRegSquarePlus } from 'react-icons/fa6';

import { PageHeading } from '@app/dashboard/components/PageComponents';
import { useProject, useTemplateList, useWebasystApplicationList } from '@lib/state';
import { projectRoute } from '../../../routes';
import { TemplateListTable } from '@app/dashboard/template/components/TemplateListTable';
import { AppLoadingState } from '@ui/atomic/templates/AppLoadingState';
import { CreateTemplateButton } from '@app/dashboard/template/components/CreateTemplateButton';

export function TemplateList() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);
  const { templateList } = useTemplateList(projectId!);
  const { appList } = useWebasystApplicationList();

  const projectApp = appList.find((app) => app.app_id === project.app_id)!;

  return (
    <>
      <Flex
        justify="space-between"
        alignItems="center"
        mb={12}
      >
        <Flex
          alignItems="center"
          gap="12px"
        >
          <Image
            src={projectApp.icon}
            alt={projectApp.app_id}
            width="32px"
            flexShrink={0}
          />
          <PageHeading>{project.name}</PageHeading>
        </Flex>
        <CreateTemplateButton
          size="sm"
          variant="outline"
          py={4}
          leftIcon={<FaRegSquarePlus size={18} />}
          // onClick={modal.modalDisclosure.onOpen}
          // {...props}
        >
          Create Template
        </CreateTemplateButton>
      </Flex>
      <Heading
        as="h4"
        size="md"
      >
        Template List
      </Heading>
      <TemplateListTable templateList={templateList} />
    </>
  );
}

export function TemplateListPage() {
  return (
    <Container
      maxW="960px"
      padding="3rem 5rem"
    >
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
