import { Button, Card, ChakraProps } from '@chakra-ui/react';
import { FaCirclePlus, FaRegSquarePlus } from 'react-icons/fa6';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { FormSkeleton } from '@ui/atomic/molecules';
import { UpsertProjectForm } from '@app/dashboard/project/components/UpsertProjectForm';

export function CreateProjectButton(props: ChakraProps) {
  const modal = useModal();
  const { t } = useTranslation();

  return (
    <>
      <Button
        size="sm"
        py={4}
        leftIcon={<FaRegSquarePlus size={18} />}
        onClick={modal.modalDisclosure.onOpen}
        {...props}
      >
        {t('Create Project')}
      </Button>
      <ModalProvider {...modal}>
        <Modal
          title={t('Create Project')}
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

export function CreateProjectCard(props: ChakraProps) {
  const modal = useModal();
  return (
    <>
      <Card
        justifyContent="center"
        alignItems="center"
        height="100%"
        minH="260px"
        shadow="xs"
        transition="background 0.1s ease-in-out"
        bg="transparent"
        border="1px solid"
        borderColor="ebony.50"
        borderRadius="8px"
        cursor="pointer"
        onClick={modal.modalDisclosure.onOpen}
        _hover={{
          borderColor: 'dodger.200',
        }}
        _dark={{ borderColor: 'ebony.600' }}
        {...props}
      >
        <FaCirclePlus
          size={62}
          style={{ opacity: 0.5 }}
        />
        <Button
          size="sm"
          mt="42px"
          py={4}
        >
          Create New Project
        </Button>
      </Card>
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
