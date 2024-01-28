import { Button, ChakraProps } from '@chakra-ui/react';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { Suspense } from 'react';

import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { FormSkeleton } from '@ui/atomic/molecules';
import { UpsertProjectForm } from '@app/dashboard/project/components/UpsertProjectForm';

export function CreateProjectButton(props: ChakraProps) {
  const modal = useModal();
  return (
    <>
      <Button
        size="sm"
        py={4}
        leftIcon={<FaRegSquarePlus size={18} />}
        onClick={modal.modalDisclosure.onOpen}
        {...props}
      >
        Create Project
      </Button>
      <ModalProvider {...modal}>
        <Modal
          title="Create Project"
          showSecondaryButton={false}
          primaryButtonLabel="Create"
          isCentered
          {...modal.modalProps}
          {...modal.modalDisclosure}
        >
          <Suspense fallback={<FormSkeleton />}>
            <UpsertProjectForm />
          </Suspense>
        </Modal>
      </ModalProvider>
    </>
  );
}
