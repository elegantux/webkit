import { Button, Flex, useToast } from '@chakra-ui/react';
import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FaAngleLeft, FaCirclePlus, FaFloppyDisk } from 'react-icons/fa6';
import { AxiosError } from 'axios';

import { useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { editorRoute } from '../../../routes';
import { useTemplate } from '@lib/state';

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
          _hover={{ textDecoration: 'none' }}
          // isLoading
          size="sm"
          onClick={() => navigate({ to: '/app/dashboard/project-list' })}
          leftIcon={<FaAngleLeft />}
        >
          Back
        </Button>
      </Flex>
      <Button
        colorScheme="dodger"
        size="sm"
        onClick={openBlockListSidebar}
        leftIcon={<FaCirclePlus size={20} />}
        iconSpacing="6px"
      >
        Add Block
      </Button>
      <SaveProject />
    </Flex>
  );
}
