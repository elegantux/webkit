import {
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FaEllipsis, FaRegPenToSquare, FaRegTrashCan, FaTriangleExclamation } from 'react-icons/fa6';
import { MouseEvent } from 'react';
import { AxiosError } from 'axios';

import { Template } from '@lib/models/template';
import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { useTemplateList } from '@lib/state';
import { appUrl, getInfoToastObject } from '@lib/utils';
import { TEMPLATE_LOCATION_NAME_MAP } from '@app/dashboard/lib/constants';
import { UpsertTemplateForm } from '@app/dashboard/template/components/UpsertTemplateForm';
import { Project } from '@lib/models/project';

function MoreActionsColumn({ template, project }: { template: Template; project: Project }) {
  const upsertModal = useModal();
  const deleteModal = useDisclosure();
  const menu = useDisclosure();
  const toast = useToast();

  const { deleteTemplate, isLoading } = useTemplateList(template.wtp_project_id);

  // Stop propagating the click to parent nodes because the parent <Tr> has link behavior.
  const handleMenuItemClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate(template.id);

      deleteModal.onClose();

      toast({
        title: 'Template deleted successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
      toast(getInfoToastObject());
    }
  };

  return (
    <Td
      width="100px"
      textAlign="right"
      onClick={handleMenuItemClick}
    >
      <ModalProvider {...upsertModal}>
        <Modal
          title="Update Template"
          primaryButtonLabel="Update"
          showSecondaryButton={false}
          isCentered
          {...upsertModal.modalProps}
          {...upsertModal.modalDisclosure}
        >
          <UpsertTemplateForm
            template={template}
            project={project}
          />
        </Modal>
      </ModalProvider>
      <Modal
        title="Delete Template"
        onPrimaryButtonClick={handleDeleteTemplate}
        primaryButtonLabel="Delete"
        showSecondaryButton={false}
        primaryButtonColorScheme="scarlet"
        isPrimaryButtonLoading={isLoading}
        isCentered
        {...deleteModal}
      >
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="24px"
          mt={4}
        >
          <Text color="scarlet.200">
            <FaTriangleExclamation size={42} />
          </Text>
          <Heading
            as="h5"
            size="md"
            textAlign="center"
            color="grey.900"
            _dark={{ color: 'grey.300' }}
          >
            By deleting this template, you will lose all assets used in template.
          </Heading>
          <Text>Are you sure?</Text>
        </Flex>
      </Modal>
      <Menu
        isOpen={menu.isOpen}
        onClose={menu.onClose}
        placement="bottom-end"
      >
        <MenuButton
          as={IconButton}
          size="sm"
          aria-label="Options"
          icon={<FaEllipsis size={20} />}
          variant="outline"
          colorScheme="grey"
          borderRadius="full"
          border="none"
          mr={0}
          flexShrink={0}
          onClick={menu.onOpen}
        />
        <MenuList
          minW="130px"
          p={2}
        >
          <MenuItem
            as={Button}
            variant="ghost"
            colorScheme="grey"
            size="sm"
            icon={<FaRegPenToSquare size={14} />}
            onClick={upsertModal.modalDisclosure.onOpen}
          >
            Edit
          </MenuItem>
          <MenuItem
            as={Button}
            variant="ghost"
            colorScheme="grey"
            size="sm"
            icon={<FaRegTrashCan size={14} />}
            onClick={deleteModal.onOpen}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );
}

export function TemplateListTable({
  templateList,
  project,
  showActions = true,
}: {
  templateList: Template[];
  project: Project;
  showActions?: boolean;
}) {
  const handleTableRowClick = (template: Template) => {
    window.location.href = appUrl(`/app/editor/${template.id}`);
  };

  return (
    <TableContainer
      border="1px solid"
      borderColor="grey.200"
      _dark={{ borderColor: 'grey.700' }}
      borderRadius="lg"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Location</Th>
            <Th>Status</Th>
            {showActions && <Th textAlign="right">Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {templateList.map((template) => (
            <Tr
              key={template.wtp_id}
              cursor="pointer"
              onClick={() => handleTableRowClick(template)}
            >
              <Td>{template.name}</Td>
              <Td>{TEMPLATE_LOCATION_NAME_MAP[template.wtp_template_location]}</Td>
              <Td>
                <Tag colorScheme={template.wtp_status === '1' ? 'malachite' : 'grey'}>
                  {template.wtp_status === '1' ? 'On' : 'Off'}
                </Tag>
              </Td>
              {showActions && (
                <MoreActionsColumn
                  template={template}
                  project={project}
                />
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
