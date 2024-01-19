import { Grid, GridItem } from '@chakra-ui/react';
import { Editor as EditorInterface } from 'grapesjs';
import { useEffectOnce } from 'usehooks-ts';
import { useParams } from 'react-router-dom';
import 'grapesjs/dist/css/grapes.min.css';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { Plugin, PluginDependencies, PluginPayload } from '@lib/models/plugin';
import { useTemplate } from '@lib/state';
import { usePluginsDependencies } from '@app/editor/lib/state';
import { Template } from '@lib/models/template';
import { Navbar } from '@app/editor/components/Navbar';
import { Sidebar } from '@app/editor/components/Sidebar';
import { Canvas } from '@app/editor/components/Canvas';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { styleManagerConfig } from '@app/editor/components/style-manager/lib/constant';

const extractPluginsBlocks = (plugins: Plugin[]) => {
  return plugins.map((plugin) => plugin.blocks).flat();
};

const extractPluginsComponents = (plugins: Plugin[]) => {
  return plugins.map((plugin) => plugin.components).flat();
};

const getPlugins = async (plugins: Function[], payload: PluginPayload): Promise<Plugin[]> => {
  const pluginList: Plugin[] = [];
  for (let i = 0; i < plugins.length; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await plugins[i](payload);
      pluginList.push(result);
    } catch (error) {
      console.error(`Ошибка в функции под индексом ${i}:`, error);
    }
  }
  return pluginList;
};

const initPluginsComponents = (components: Plugin['components'], e: EditorInterface) => {
  components.forEach((component) => {
    try {
      e.DomComponents.addType(component.type, component.definition);
    } catch (error) {
      console.error(`Ошибка при добавлении инициализации компонента ${component.type}:`, error);
    }
  });
};

const initEditor = async (template: Template, pluginsDependencies: PluginDependencies) => {
  // eslint-disable-next-line prefer-destructuring
  const init = useEditorStore.getState().init;

  // @ts-ignore
  const plugins = await getPlugins(window.webkit.plugins.functions, { template });

  const pluginsBlocks = extractPluginsBlocks(plugins);
  const pluginsComponents = extractPluginsComponents(plugins);

  const editor = init({
    container: '#editor-container',
    width: '100%',
    height: '100%',
    blockManager: {
      appendTo: '.myblocks',
      blocks: pluginsBlocks,
    },
    // traitManager: {
    //   appendTo: '.my-traits',
    // },
    panels: {
      defaults: [],
    },
    styleManager: styleManagerConfig,
    // blockManager: { custom: true },
    // deviceManager: { custom: true },
    // // styleManager: { custom: true },
    // layerManager: { custom: true },
    // traitManager: { custom: true },
    // selectorManager: { custom: true },
    canvas: {
      styles: pluginsDependencies.styles,
      scripts: pluginsDependencies.scripts,
      frameStyle: `
        body { background-color: #fff }
        * ::-webkit-scrollbar-track { background: #eee; }
        * ::-webkit-scrollbar-thumb { background: #ccc; }
        * ::-webkit-scrollbar { width: 8px }
      `,
    },
    plugins: [
      (e) => {
        // Wrapper - is just a gjs wrapper for content editing.
        // This component is not included in the export data, so we remove all styling actions from this component.
        e.DomComponents.addType('wrapper', {
          isComponent: (el) => el.dataset['data-gjs-type'] === 'wrapper',
          model: {
            defaults: {
              toolbar: [],
              stylable: false,
            },
          },
        });
      },
      (e) => {
        e.DomComponents.addType('default.container', {
          isComponent: (el) => {
            if (el.tagName) {
              console.log('el.dataset', el, el.tagName);
              return el.dataset['data-gjs-type'] === 'default.container';
            }
            return false;
          },
          model: {
            defaults: {
              tagName: 'div',
              name: 'Container',
              attributes: { 'data-gjs-type': 'default.container' },
              style: { padding: '12px' },
              resizable: true,
              // components: `<div>Container</div>`,
            },
          },
        });
        const block = {
          label: 'Container',
          category: 'Basic',
          // content: { type: 'image' },
          content: { type: 'default.container' },
          // The component `image` is activatable (shows the Asset Manager).
          // We want to activate it once dropped in the canvas.
          activate: true,
          // select: true, // Default with `activate: true`
        };

        e.Blocks.add('default.container', block);
      },
      (e) => initPluginsComponents(pluginsComponents, e),
      (e) => {
        console.log('types', e.DomComponents.getTypes());
      },
    ],
  });

  editor.Commands.add(EDITOR_COMMANDS.UPDATE_STYLE_MANAGER_PROPERTY, { run() {} });
};

export function Editor() {
  const { id: templateId } = useParams();
  const { template } = useTemplate(Number(templateId));
  const { pluginsDependencies } = usePluginsDependencies(Number(templateId));

  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  useEffectOnce(() => {
    initEditor(template, pluginsDependencies);
    console.log('editor', editor);
  });

  return (
    <Grid
      templateAreas={`
        "header header"
        "sidebar canvas"
      `}
      gridTemplateRows="54px 1fr"
      gridTemplateColumns="320px 1fr"
      height="calc(100vh - 64px)"
    >
      {editor && (
        <>
          <GridItem area="header">
            <Navbar />
          </GridItem>
          <GridItem
            area="sidebar"
            overflowY="auto"
          >
            <Sidebar />
          </GridItem>
        </>
      )}
      <GridItem area="canvas">
        <Canvas />
      </GridItem>
    </Grid>
  );
}
