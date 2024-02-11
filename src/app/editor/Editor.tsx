import { Grid, GridItem } from '@chakra-ui/react';
import { Editor as EditorInterface } from 'grapesjs';
import { useEffectOnce } from 'usehooks-ts';
import 'grapesjs/dist/css/grapes.min.css';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PluginDependencies } from '@lib/models/plugin';
import { useTemplate, useTemplateProject } from '@lib/state';
import { usePluginsDependencies } from '@app/editor/lib/state';
import { Template } from '@lib/models/template';
import { Navbar } from '@app/editor/components/Navbar';
import { Sidebar } from '@app/editor/components/Sidebar';
import { Canvas } from '@app/editor/components/Canvas';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { styleManagerConfig } from '@app/editor/components/style-manager/lib/constant';
import { editorRoute } from '../../routes';

const loadPlugins = async (
  editor: EditorInterface,
  params: { pluginList: Function[]; pluginListOptions: Array<Record<any, any>>; onFinished: Function }
) => {
  console.log('loadPlugins', editor, params);
  const { pluginList, pluginListOptions, onFinished } = params;

  for (let i = 0; i < pluginList.length; i++) {
    const plugin = pluginList[i];
    if (typeof plugin !== 'function') {
      return console.log('The plugin definition is incorrect!', plugin);
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      await plugin(editor, pluginListOptions[plugin]);
    } catch (error) {
      console.error(`Ошибка в функции под индексом ${i}:`, error);
    }
  }
  console.log('>>>>>>>>>> onFinished');
  onFinished(editor);
  return true;
};

const initEditor = async (template: Template, pluginsDependencies: PluginDependencies) => {
  // eslint-disable-next-line prefer-destructuring
  const init = useEditorStore.getState().init;
  const { setArePluginsLoaded } = useEditorStore.getState();

  // @ts-ignore
  // const plugins = await getPlugins(window.webkit.plugins.functions, { template });
  // const pluginsBlocks = extractPluginsBlocks(plugins);
  // const pluginsComponents = extractPluginsComponents(plugins);

  const pluginOptions: Record<any, CallableFunction> = {};
  window.webkit.plugins.functions.forEach((plugin: CallableFunction) => {
    pluginOptions[plugin] = { template };
  });

  const onPluginsLoaded = async (e: EditorInterface) => {
    const projectData = template.editor_components
      ? {
          pages: template.editor_components,
          assets: template.editor_assets,
          styles: template.editor_styles,
        }
      : {
          pages: [
            {
              id: 'current-page',
              // styles: `.my-class { color: red }`, // or a JSON of styles
              // component: '<div class="my-class">My element</div>', // or a JSON of components
            },
          ],
          assets: [],
          styles: [],
        };

    console.log('projectData', projectData);
    e.loadProjectData(projectData);

    // Load project data before canvas render
    // e.loadProjectData(JSON.parse(localStorage.getItem('gjsProject')));
    // Rerender Editor canvas when plugins are loaded
    e.render();
    // Enable canvas
    setArePluginsLoaded(true);
    // Log
    e.log('Plugins are loaded', { ns: 'log', level: 'info' });
  };

  const editor = init({
    container: '#editor-container',
    width: '100%',
    height: '100%',
    autorender: false,
    showOffsets: true,
    showOffsetsSelected: true,
    storageManager: false,
    styleManager: styleManagerConfig,
    blockManager: { custom: true },
    traitManager: { custom: true },
    selectorManager: {
      componentFirst: true,
      custom: true,
    },
    panels: {
      defaults: [],
    },
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
    // pluginsOpts: pluginOptions,
    pluginsOpts: {
      [loadPlugins]: {
        pluginList: window.webkit.plugins.functions,
        pluginListOptions: pluginOptions,
        onFinished: onPluginsLoaded,
      },
    },
    plugins: [
      // ...window.webkit.plugins.functions,
      loadPlugins,
      (e) => {
        // Wrapper - is just a gjs wrapper for content editing.
        // This component is not included in the export data, so we remove all styling actions from this component.
        e.DomComponents.addType('wrapper', {
          isComponent: (el) => el.dataset['data-gjs-type'] === 'wrapper',
          model: {
            defaults: {
              toolbar: [],
              stylable: false,
              selectable: false,
              highlightable: false,
            },
          },
        });
      },
      (e) => {
        console.log('types', e.DomComponents.getTypes());
      },
    ],
  });

  // Custom commands
  editor.Commands.add(EDITOR_COMMANDS.UPDATE_STYLE_MANAGER_PROPERTY, { run() {} });
  editor.Commands.add(EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY, { run() {} });
  editor.Commands.add(EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY_LIST, { run() {} });
  editor.on('log:info', (msg, opts) => console.info(`[WebKit Editor] - ${msg}`, opts));
};

export function Editor() {
  const { templateId } = editorRoute.useParams();
  const { template } = useTemplate(Number(templateId));
  const { pluginsDependencies } = usePluginsDependencies(Number(templateId));

  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  useEffectOnce(() => {
    initEditor(template, pluginsDependencies);
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
      bgColor="webasyst.backgroundColor"
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
