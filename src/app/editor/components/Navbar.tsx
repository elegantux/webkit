import { Button, Flex, IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  FaAngleLeft,
  FaCirclePlus,
  FaFloppyDisk,
  FaMobileButton,
  FaTabletButton,
  FaTv,
  FaVectorSquare,
} from 'react-icons/fa6';
import { AxiosError } from 'axios';

import { EDITOR_STORE, useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { editorRoute } from '../../../routes';
import { useTemplate } from '@lib/state';

export const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE_PORTRAIT: 'mobilePortrait',
  MOBILE_LANDSCAPE: 'mobileLandscape',
};

export const DEVICE_TYPE_NAME = {
  [DEVICE_TYPE.DESKTOP]: 'Desktop',
  [DEVICE_TYPE.TABLET]: 'Tablet',
  [DEVICE_TYPE.MOBILE_PORTRAIT]: 'Mobile Portrait',
  [DEVICE_TYPE.MOBILE_LANDSCAPE]: 'Mobile Landscape',
};

export const DEVICE_TYPE_ICON = {
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

  const handleDeviceButtonClick = (device: string) => {
    editor.setDevice(device);
    setSelectedDevice(device);
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
            onClick={() => handleDeviceButtonClick(device)}
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
  const navigate = useNavigate();
  const openBlockListSidebar = useBlockListDisclosure((state) => state.onOpen);
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
      <Flex>
        <Button
          colorScheme="dodger"
          variant="link"
          size="sm"
          leftIcon={<FaAngleLeft />}
          _hover={{ textDecoration: 'none' }}
          onClick={() => navigate({ to: '/app/dashboard/project-list' })}
        >
          Back
        </Button>
      </Flex>
      <Flex gap="32px">
        <Button
          colorScheme="dodger"
          size="sm"
          leftIcon={<FaCirclePlus size={20} />}
          iconSpacing="6px"
          onClick={openBlockListSidebar}
        >
          Add Block
        </Button>
        <ResponsiveButtons />
      </Flex>
      <SaveProject />
    </Flex>
  );
}
