import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { Suspense, memo, useEffect, useState } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import {
  FaAngleLeft,
  FaChevronDown,
  FaCirclePlus,
  FaFloppyDisk,
  FaMagnifyingGlass,
  FaMobileButton,
  FaTabletButton,
  FaTv,
  FaVectorSquare,
} from 'react-icons/fa6';
import { AxiosError } from 'axios';
import { Device } from 'grapesjs';

import { EDITOR_STORE, useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { editorRoute } from '../../../routes';
import { useRecentTemplateList, useTemplate } from '@lib/state';
import { Modal, ModalProvider, useModal } from '@ui/atomic/organisms/modal';
import { appUrl } from '@lib/utils.tsx';
import { Template } from '@lib/models/template';
import { TemplateLibrary } from '@app/editor/components/TemplateLibrary';
import { DEVICE_TYPE, DEVICE_TYPE_NAME } from '@app/editor/lib/constant';

const DEVICE_TYPE_ICON = {
  [DEVICE_TYPE.DESKTOP]: <FaTv size={16} />,
  [DEVICE_TYPE.TABLET]: <FaTabletButton size={16} />,
  [DEVICE_TYPE.MOBILE_LANDSCAPE]: <FaMobileButton size={16} />,
  [DEVICE_TYPE.MOBILE_PORTRAIT]: <FaMobileButton size={16} />,
};

function extractTypesFromJson(json: any): string[] {
  const types = new Set<string>(); // Use a Set to ensure uniqueness

  function traverse(node: any) {
    if (Array.isArray(node)) {
      // If the current node is an array, iterate over each element
      node.forEach((element) => traverse(element));
    } else if (typeof node === 'object' && node !== null) {
      // If the current node is an object, check for the 'type' property
      if (node.type) {
        types.add(node.type); // Add the type to the Set if it exists
      }
      // Recurse into each property of the object
      Object.values(node).forEach((value) => traverse(value));
    }
  }

  traverse(json); // Start the traversal from the root

  return Array.from(types); // Convert the Set to an Array and return it
}

function TemplateNavigation() {
  const { templateId } = editorRoute.useParams();
  const { template } = useTemplate(Number(templateId));
  const { templateList } = useRecentTemplateList();

  const handleTemplateClick = (temp: Template) => {
    window.location.href = appUrl(`/app/editor/${temp.id}`);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        size="sm"
        colorScheme="grey"
        rightIcon={<FaChevronDown size={12} />}
      >
        {template.name}
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuGroup title="Recently edited templates">
            {templateList.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleTemplateClick(item)}
              >
                {item.name}
              </MenuItem>
            ))}
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}

const SaveProject = memo(() => {
  const toast = useToast();

  const { templateId } = editorRoute.useParams();
  const { template, updateTemplate } = useTemplate(Number(templateId));
  console.log('SaveProject - template', template);

  const editor = useEditorStore((state) => state.editor);

  const handleSave = async () => {
    const { assets, pages, styles } = editor.getProjectData();
    // Temp save
    // localStorage.setItem('gjsProject', JSON.stringify(editor.getProjectData()));

    const mainComponent = editor.getWrapper();

    // Keep smarty arrows {$wa->}
    const html = mainComponent?.getInnerHTML().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const css = editor.getCss({ component: mainComponent });
    const js = editor.getJs({ component: mainComponent });
    console.log({
      html,
      css,
      js,
    });

    const projectComponentTypes = extractTypesFromJson(pages).filter((type: string) => type.includes('_'));

    try {
      // Save
      await updateTemplate({
        templateId: template.id,
        payload: {
          name: template.name,
          wtp_id: template.wtp_id,
          wtp_status: template.wtp_status,
          //
          editor_assets: JSON.stringify(assets),
          editor_components: JSON.stringify(pages),
          editor_styles: JSON.stringify(styles),
          //
          front_content: html,
          front_styles: css ?? '',
          front_scripts: js,
          //
          component_types: projectComponentTypes.join(','),
        },
      });
      toast({
        title: 'Project saved successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
    }
  };

  return (
    <Button
      colorScheme="malachite"
      size="sm"
      onClick={handleSave}
      leftIcon={<FaFloppyDisk size={20} />}
    >
      Save
    </Button>
  );
});

function ResponsiveButtons() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const commands = editor.Commands;

  const [selectedDevice, setSelectedDevice] = useState<string>(DEVICE_TYPE.DESKTOP);
  const [swVisibility, setSwVisibility] = useState(false);

  const handleUpdateDevice = (device: Device) => {
    setSelectedDevice(device.id as string);
  };

  const toggleComponentsBorderHandler = () => {
    const isBordersVisible = commands.isActive('sw-visibility');
    if (isBordersVisible) {
      commands.stop('sw-visibility');
    } else {
      editor.runCommand('sw-visibility');
    }

    setSwVisibility(commands.isActive('sw-visibility'));
  };

  // Listen to device:select event to be aware if the device changes from somewhere else.
  // For example from ChildSelectors.tsx
  useEffect(() => {
    editor.on('device:select', handleUpdateDevice);

    return () => {
      editor.off('device:select', handleUpdateDevice);
    };
  }, []);

  return (
    <Flex>
      {Object.values(DEVICE_TYPE).map((device) => (
        <Tooltip
          key={device}
          placement="bottom"
          borderRadius="4px"
          label={DEVICE_TYPE_NAME[device]}
          hasArrow
        >
          <IconButton
            variant="ghost"
            size="sm"
            colorScheme={selectedDevice === device ? 'dodger' : 'grey'}
            aria-label={DEVICE_TYPE_NAME[device]}
            icon={DEVICE_TYPE_ICON[device]}
            {...(device === DEVICE_TYPE.MOBILE_LANDSCAPE ? { transform: 'rotate(90deg)' } : {})}
            onClick={() => editor.setDevice(device)}
          />
        </Tooltip>
      ))}
      <Tooltip
        placement="bottom"
        borderRadius="4px"
        label="Toggle components visibility"
        hasArrow
      >
        <IconButton
          variant="ghost"
          size="sm"
          colorScheme={swVisibility ? 'dodger' : 'grey'}
          aria-label="Toggle components visibility"
          icon={<FaVectorSquare size={16} />}
          onClick={() => toggleComponentsBorderHandler()}
        />
      </Tooltip>
    </Flex>
  );
}

export function Navbar() {
  const templatesModal = useModal();
  const navigate = useNavigate();
  const router = useRouter();
  const openBlockListSidebar = useBlockListDisclosure((state) => state.onOpen);

  const handleBackButtonClick = () => {
    try {
      router.history.back();
    } catch (_e) {
      navigate({ to: '/app/dashboard/project-list' });
    }
  };

  return (
    <Flex
      bg="var(--background-color)"
      alignItems="center"
      px="16px"
      height="100%"
      justify="space-between"
      borderTop="2px solid"
      borderBottom="2px solid"
      borderColor="var(--chakra-colors-chakra-border-color)"
    >
      <Flex gap="24px">
        <Button
          colorScheme="dodger"
          variant="link"
          size="sm"
          leftIcon={<FaAngleLeft />}
          _hover={{ textDecoration: 'none' }}
          onClick={handleBackButtonClick}
        >
          Back
        </Button>
        <Button
          colorScheme="dodger"
          size="sm"
          leftIcon={<FaCirclePlus size={20} />}
          iconSpacing="6px"
          onClick={openBlockListSidebar}
        >
          Add Block
        </Button>
      </Flex>
      <Flex gap="14px">
        <TemplateNavigation />
        <Button
          colorScheme="grey"
          variant="ghost"
          size="sm"
          onClick={templatesModal.modalDisclosure.onOpen}
          leftIcon={<FaMagnifyingGlass size={16} />}
        >
          Templates
        </Button>
        <ResponsiveButtons />
      </Flex>
      <SaveProject />
      <ModalProvider {...templatesModal}>
        <Modal
          scrollBehavior="inside"
          title="Template Library"
          showModalFooter={false}
          modalContentProps={{
            width: '100vw',
            maxW: '1120px',
            top: '5vh',
          }}
          {...templatesModal.modalProps}
          {...templatesModal.modalDisclosure}
        >
          <Suspense
            fallback={
              <Flex
                justify="center"
                my="62px"
              >
                <Spinner />
              </Flex>
            }
          >
            <TemplateLibrary />
          </Suspense>
        </Modal>
      </ModalProvider>
    </Flex>
  );
}
