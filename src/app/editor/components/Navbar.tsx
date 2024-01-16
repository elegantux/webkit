import { Button, Flex, IconButton, useColorModeValue } from '@chakra-ui/react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft, FaCirclePlus, FaFloppyDisk } from 'react-icons/fa6';

import { useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';

const SaveProject = memo(() => {
  const editor = useEditorStore((state) => state.editor);

  const handleSave = () => {
    const { assets, pages, styles } = editor.getProjectData();

    // Get only types added via plugins
    const pluginsComponentTypes = editor.DomComponents.getTypes()
      .map((component) => component.id)
      .filter((id) => id.includes('.') && !id.startsWith('default'));

    // const wrapper = editor.getWrapper();
    // const html = wrapper.getInnerHTML();
    // const css = editor.getCss({
    //   // keepUnusedStyles: true,
    // });
    // const scripts = editor.getJs();
    //
    // console.log('editor.getProjectData()', editor.getProjectData());
    // console.log({
    //   html,
    //   css,
    //   scripts,
    // });

    // const page = editor.Pages.getAll()[0];
    // console.log('page', page);
    // const mainComponent = page.getMainComponent();
    const mainComponent = editor.getWrapper();

    const pluginComponentsUsages = pluginsComponentTypes.map((type) => ({
      type,
      components: mainComponent?.findType(type) ?? [],
    }));

    // Find only used components and return their plugin names
    const usedPluginName = pluginComponentsUsages
      .filter((usage) => usage.components?.length > 0)
      .map((usage) => usage.type.split('.')[0]);

    const usedChildTemplateIdList = pluginComponentsUsages
      .filter((usage) => {
        const templateIdTriteList = usage.components.map((component) => {
          return component.getTrait('templateId');
        });
        console.log('templateIdTriteList', templateIdTriteList);
        return templateIdTriteList.length > 0;
      })
      .map((usage) => true);

    // console.log('pluginsComponentTypes', pluginsComponentTypes, pluginComponentsUsages, usedPluginName);

    const html = mainComponent.getInnerHTML();
    // const html = editor.getHtml({ component: mainComponent });
    const css = editor.getCss({ component: mainComponent });
    const js = editor.getJs({ component: mainComponent });
    console.log({
      html,
      css,
      js,
    });
  };

  return (
    <Button
      colorScheme="malachite"
      size="sm"
      onClick={handleSave}
      leftIcon={<FaFloppyDisk />}
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
          onClick={() => navigate(-1)}
          leftIcon={<FaAngleLeft />}
        >
          Back
        </Button>
        {/* <IconButton */}
        {/*  aria-label="Open Sidebar" */}
        {/*  colorScheme="dodger" */}
        {/*  // isLoading */}
        {/*  size="sm" */}
        {/*  onClick={() => navigate(-1)} */}
        {/*  icon={<FaCirclePlus size={20} />} */}
        {/* /> */}
      </Flex>
      <Button
        colorScheme="dodger"
        // isLoading
        size="sm"
        onClick={openBlockListSidebar}
        leftIcon={<FaCirclePlus size={20} />}
        iconSpacing="6px"
        ml="24px"
      >
        Add Block
      </Button>
      <SaveProject />
    </Flex>
  );
}
