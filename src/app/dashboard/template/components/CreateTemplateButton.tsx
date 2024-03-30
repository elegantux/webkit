import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Image,
  Text,
  useColorMode,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { PropsWithChildren, Suspense } from 'react';

import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { FormSkeleton } from '@ui/atomic/molecules';
import { CreateProjectTemplateFlow } from '@app/dashboard/template/components/add-project-template-flow/CreateProjectTemplateFlow';
import { projectRoute } from '../../../../routes';
import { useProject } from '@lib/state';
import { TEMPLATE_PROJECT_TEMPLATE_TYPES } from '@lib/models/template';
import { appPath } from '@lib/utils.tsx';
import { UpsertTemplateForm } from '@app/dashboard/template/components/UpsertTemplateForm';

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

export function CreateTemplateTypeButton({ children, ...props }: PropsWithChildren<ButtonProps>) {
  const modal = useModal();
  const themeTemplateModal = useModal();
  const loopTemplateModal = useModal();
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId!);

  const mode = useColorMode();
  const theme = useTheme();
  const boxShadowColor = useColorModeValue(theme.colors.grey[50], theme.colors.ebony[900]);
  const borderColor = useColorModeValue(theme.colors.grey[100], theme.colors.ebony[800]);

  const handleTemplateTypeSubmit = (type: TEMPLATE_PROJECT_TEMPLATE_TYPES) => {
    switch (type) {
      case TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT:
        modal.modalDisclosure.onClose();
        themeTemplateModal.modalDisclosure.onOpen();
        break;
      case TEMPLATE_PROJECT_TEMPLATE_TYPES.LOOP:
        modal.modalDisclosure.onClose();
        loopTemplateModal.modalDisclosure.onOpen();
        break;
      default:
        break;
    }
  };

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
      <Modal
        title="Choose template type"
        showModalFooter={false}
        isCentered
        minWidth="760px"
        {...modal.modalProps}
        {...modal.modalDisclosure}
      >
        <Text>Choose which type of templates you want to create.</Text>
        <Flex
          justify="center"
          gap="62px"
          my="62px"
        >
          <Box
            role="group"
            onClick={() => handleTemplateTypeSubmit(TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT)}
          >
            <Text
              fontSize="14px"
              fontWeight="600"
              mb="8px"
            >
              Theme Template
            </Text>
            <Image
              src={appPath(`/img/template-types/default-${mode.colorMode}.svg`)}
              fallback={<Text>Image Not Found!</Text>}
              cursor="pointer"
              borderRadius="lg"
              boxShadow={`0 0 12px 4px ${boxShadowColor}`}
              border="1px solid"
              borderColor={borderColor}
              _groupHover={{ borderColor: 'dodger.500' }}
            />
          </Box>
          <Box
            role="group"
            onClick={() => handleTemplateTypeSubmit(TEMPLATE_PROJECT_TEMPLATE_TYPES.LOOP)}
          >
            <Text
              fontSize="14px"
              fontWeight="600"
              mb="8px"
            >
              Loop Template
            </Text>
            <Image
              src={appPath(`/img/template-types/loop-${mode.colorMode}.svg`)}
              fallback={<Text>Image Not Found!</Text>}
              cursor="pointer"
              borderRadius="lg"
              boxShadow={`0 0 12px 4px ${boxShadowColor}`}
              border="1px solid"
              borderColor={borderColor}
              _groupHover={{ borderColor: 'dodger.500' }}
            />
          </Box>
        </Flex>
      </Modal>
      <ModalProvider {...themeTemplateModal}>
        <Modal
          title="Create a theme template"
          minWidth="820px"
          scrollBehavior="inside"
          showModalFooter={false}
          isCentered
          {...themeTemplateModal.modalProps}
          {...themeTemplateModal.modalDisclosure}
        >
          <Suspense fallback={<FormSkeleton />}>
            <CreateProjectTemplateFlow project={project} />
          </Suspense>
        </Modal>
      </ModalProvider>
      <ModalProvider {...loopTemplateModal}>
        <Modal
          title="Create a loop template"
          scrollBehavior="inside"
          isCentered
          {...loopTemplateModal.modalProps}
          {...loopTemplateModal.modalDisclosure}
        >
          <Suspense fallback={<FormSkeleton />}>
            <UpsertTemplateForm
              templateType={TEMPLATE_PROJECT_TEMPLATE_TYPES.LOOP}
              project={project}
            />
          </Suspense>
        </Modal>
      </ModalProvider>
    </>
  );
}
