import { Button, ButtonProps } from '@chakra-ui/react';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { PropsWithChildren, Suspense } from 'react';

import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { FormSkeleton } from '@ui/atomic/molecules';
import { CreateProjectTemplateFlow } from '@app/dashboard/template/components/add-project-template-flow/CreateProjectTemplateFlow';
import { projectRoute } from '../../../../routes';
import { useProject } from '@lib/state';

export function CreateTemplateButton({ children, ...props }: PropsWithChildren<ButtonProps>) {
  const modal = useModal();
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);

  return (
    <>
      <Button
        size="sm"
        py={4}
        leftIcon={<FaRegSquarePlus size={18} />}
        onClick={modal.modalDisclosure.onOpen}
        {...props}
      >
        {children}
      </Button>
      <ModalProvider {...modal}>
        <Modal
          title="Create a theme template"
          minWidth="820px"
          scrollBehavior="inside"
          showModalFooter={false}
          isCentered
          {...modal.modalProps}
          {...modal.modalDisclosure}
          // isOpen
        >
          <Suspense fallback={<FormSkeleton />}>
            <CreateProjectTemplateFlow project={project} />
          </Suspense>
        </Modal>
      </ModalProvider>
    </>
  );
}
