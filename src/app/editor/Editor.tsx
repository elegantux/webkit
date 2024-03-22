import { Grid, GridItem } from '@chakra-ui/react';
import { Editor as EditorInterface } from 'grapesjs';
import { useEffectOnce } from 'usehooks-ts';
import 'grapesjs/dist/css/grapes.min.css';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PluginDependencies } from '@lib/models/plugin';
import { useTemplate, useThemeSettings } from '@lib/state';
import { usePluginsDependencies } from '@app/editor/lib/state';
import { Template } from '@lib/models/template';
import { Navbar } from '@app/editor/components/Navbar';
import { Sidebar } from '@app/editor/components/Sidebar';
import { Canvas } from '@app/editor/components/Canvas';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { styleManagerConfig } from '@app/editor/components/style-manager/lib/constant';
import { editorRoute } from '../../routes';
import { Breadcrumbs } from '@app/editor/components/Breadcrumbs';

const loadPlugins = async (
  editor: EditorInterface,
  params: { pluginList: Function[]; pluginListOptions: Array<Record<any, any>>; onFinished: Function }
) => {
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
      console.error(`Error in function under index ${i}:`, error);
    }
  }
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

    /**
     * (experimental) v0.21.8
     */
    clearStyles: true,

    styleManager: styleManagerConfig,
    blockManager: { custom: true },
    traitManager: { custom: true },
    selectorManager: {
      componentFirst: true,
      custom: true,
    },
    // deviceManager: {
    //   devices: [
    //     { id: 'desktop', name: 'Desktop', width: '' },
    //     { id: 'tablet', name: 'Tablet', width: '770px' },
    //     { id: 'mobile', name: 'Mobile', width: '' },
    //   ],
    // },
    panels: {
      defaults: [],
    },
    canvas: {
      styles: pluginsDependencies.styles,
      scripts: pluginsDependencies.scripts,
    },
    canvasCss: `
      body { background-color: #fff }
      * ::-webkit-scrollbar-track { background: #eee; }
      * ::-webkit-scrollbar-thumb { background: #ccc; }
      * ::-webkit-scrollbar { width: 8px }
      .gjs-dashed *[data-gjs-highlightable] { outline-color: #8899aa; outline-style: dotted; outline-width: 1px; }
      body.gjs-dashed { outline: none; }
    `,
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
  editor.Commands.add(EDITOR_COMMANDS.TOGGLE_RULE_MANAGER_SIDEBAR, () => {});
  editor.on('log:info', (msg, opts) => console.info(`[WebKit Editor] - ${msg}`, opts));
};

export function Editor() {
  const { templateId } = editorRoute.useParams();
  const { template } = useTemplate(Number(templateId));
  const { pluginsDependencies } = usePluginsDependencies(Number(templateId));

  /**
   * Prefetching Theme Settings before rendering the Style Manager
   * so that we can change fields before subscribing to GJS events.
   * E.g. editor.on('style:custom', updatePropertyStyles);
   */
  useThemeSettings(template.wtp_project_id);

  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  useEffectOnce(() => {
    initEditor(template, pluginsDependencies);
  });

  return (
    <Grid
      templateAreas={`
        "header header"
        "sidebar canvas"
        "sidebar breadcrumbs"
      `}
      gridTemplateRows="54px 1fr 22px"
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
            className="hide-scrollbar"
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
      {editor && (
        <GridItem
          area="breadcrumbs"
          className="hide-scrollbar"
          overflowY="auto"
          display="flex"
          alignItems="center"
          gap="12px"
          py="2px"
          px="12px"
          bgColor="webasyst.backgroundColor"
          borderTop="2px solid"
          borderTopColor="var(--chakra-colors-chakra-border-color)"
        >
          <Breadcrumbs />
        </GridItem>
      )}
    </Grid>
  );
}
