import { Button, Flex, useToast } from '@chakra-ui/react';
import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FaAngleLeft, FaCirclePlus, FaFloppyDisk } from 'react-icons/fa6';
import { AxiosError } from 'axios';

import { useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { editorRoute } from '../../../routes';
import { useTemplate } from '@lib/state';

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

    // Get only types added via plugins
    const pluginsComponentTypes = editor.DomComponents.getTypes()
      .map((component) => component.id)
      .filter((id) => id.includes('_') && !id.startsWith('default'));

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
