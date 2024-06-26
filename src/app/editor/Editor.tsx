import { Grid, GridItem } from '@chakra-ui/react';
import { useEffectOnce } from 'usehooks-ts';
import { Editor as EditorInterface } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PluginDependencies } from '@lib/models/plugin';
import { useTemplate, useThemeSettings, useWebasystSettings } from '@lib/state';
import { usePluginsDependencies } from '@app/editor/lib/state';
import { Template } from '@lib/models/template';
import { Navbar } from '@app/editor/components/Navbar';
import { Sidebar } from '@app/editor/components/Sidebar';
import { Canvas } from '@app/editor/components/Canvas';
import { DEVICE_TYPE, DEVICE_TYPE_NAME, EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { styleManagerConfig } from '@app/editor/components/style-manager/lib/constant';
import { editorRoute } from '../../routes';
import { Breadcrumbs } from '@app/editor/components/Breadcrumbs';
import { LayerManager } from '@app/editor/components/layer-manager/LayerManager';
import { useLayerManagerStore } from '@app/editor/components/layer-manager/lib/utils';
import { ThemeSettings } from '@lib/models/theme-settings';
import { WebasystSettings } from '@lib/models/cross-app';
// Editor Locales
import styleManagerRu from '@app/editor/locale/styleManagerRu';

const loadPlugins = async (
  editor: EditorInterface,
  params: { pluginList: Function[]; pluginListOptions: Array<Record<any, any>>; onFinished: Function }
) => {
  const { pluginList, pluginListOptions, onFinished } = params;

  /**
   * The onFinished function needs to be called only after the editor has been initialized,
   * so we have to pop it from the stack.
   */
  if (pluginList.length === 0) {
    setTimeout(onFinished, 0, editor);
    return true;
  }

  for (let i = 0; i < pluginList.length; i++) {
    const plugin = pluginList[i];
    if (typeof plugin !== 'function') {
      return console.log('The plugin definition is incorrect!', plugin);
    }

    try {
      // @ts-ignore
      // eslint-disable-next-line no-await-in-loop
      await plugin(editor, pluginListOptions[plugin]);
    } catch (error) {
      console.error(`Error in function under index ${i}:`, error);
    }
  }
  onFinished(editor);
  return true;
};

const initEditor = async (
  template: Template,
  themeSettings: ThemeSettings,
  pluginsDependencies: PluginDependencies,
  webasystSettings: WebasystSettings
) => {
  // eslint-disable-next-line prefer-destructuring
  const init = useEditorStore.getState().init;
  const { setArePluginsLoaded } = useEditorStore.getState();

  // @ts-ignore
  // const plugins = await getPlugins(window.webkit.plugins.functions, { template });
  // const pluginsBlocks = extractPluginsBlocks(plugins);
  // const pluginsComponents = extractPluginsComponents(plugins);

  const pluginList = window.webkit.plugins.functions;
  const pluginOptions: Record<any, CallableFunction> = {};
  pluginList.forEach((plugin: CallableFunction) => {
    // @ts-ignore
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

    // console.log('projectData', projectData);
    e.loadProjectData(projectData);

    // Load project data before canvas render
    // e.loadProjectData(JSON.parse(localStorage.getItem('gjsProject')));
    // Rerender Editor canvas when plugins are loaded
    e.render();
    // After rendering the canvas, add styles and scripts from the Theme Settings to the canvas head.
    e.onReady(() => {
      // Theme Styles
      const style = document.createElement('style');
      style.innerHTML = themeSettings.custom_head_styles;
      e.Canvas.getDocument().head.insertAdjacentElement('beforeend', style);

      // Theme Scripts
      // const script = document.createElement('script');
      // script.type = 'text/javascript';
      // script.defer = true;
      // script.innerHTML = themeSettings.custom_head_styles;
      // e.Canvas.getBody().insertAdjacentHTML('beforeend', script.innerHTML);
    });
    // Enable canvas
    setArePluginsLoaded(true);
    // Log
    e.log('Plugins are loaded', { ns: 'log', level: 'info' });
  };

  const editor = init({
    container: '#editor-container',
    protectedCss: '', // Remove default styles: '* { box-sizing: border-box; } body {margin: 0;}'
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
    i18n: {
      locale: webasystSettings.locale,
      localeFallback: 'en',
      detectLocale: false,
      messagesAdd: {
        ru: {
          styleManager: styleManagerRu,
        },
      },
    },
    blockManager: { custom: true },
    traitManager: { custom: true },
    layerManager: {
      appendTo: '#webkit-layer-manager',
    },
    undoManager: {
      trackSelection: false,
    },
    selectorManager: {
      componentFirst: true,
      custom: true,
      states: [{ name: 'hover' }, { name: 'active' }, { name: 'focus' }, { name: 'nth-of-type(2n)' }],
    },
    deviceManager: {
      devices: [
        { id: DEVICE_TYPE.DESKTOP, name: DEVICE_TYPE_NAME[DEVICE_TYPE.DESKTOP], width: '' },
        { id: DEVICE_TYPE.TABLET, name: DEVICE_TYPE_NAME[DEVICE_TYPE.TABLET], width: '770px' },
        { id: DEVICE_TYPE.MOBILE_PORTRAIT, name: DEVICE_TYPE_NAME[DEVICE_TYPE.MOBILE_PORTRAIT], width: '480px' },
        { id: DEVICE_TYPE.MOBILE_LANDSCAPE, name: DEVICE_TYPE_NAME[DEVICE_TYPE.MOBILE_LANDSCAPE], width: '568px' },
      ],
    },
    panels: {
      defaults: [],
    },
    canvas: {
      styles: pluginsDependencies.styles,
      scripts: ['/wa-content/js/jquery/jquery-1.11.1.min.js', ...pluginsDependencies.scripts],
    },
    canvasCss: `
      * ::-webkit-scrollbar-track { background: #eee; }
      * ::-webkit-scrollbar-thumb { background: #ccc; }
      * ::-webkit-scrollbar { width: 8px }
      .gjs-dashed *[data-gjs-highlightable] { outline-color: #8899aa; outline-style: dotted; outline-width: 1px; }
      .gjs-selected { outline-color: #1a9afe !important; }
      .gjs-selected-parent { outline-color: #fbd38d !important; }
      body.gjs-dashed { outline: none; }
    `,
    // pluginsOpts: pluginOptions,
    pluginsOpts: {
      [loadPlugins as any]: {
        pluginList,
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
      // (e) => {
      //   console.log('types', e.DomComponents.getTypes());
      // },
    ],
  });

  return editor;
};

const initCommands = (editor: EditorInterface) => {
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
  const { settings: webasystSettings } = useWebasystSettings();

  /**
   * Prefetching Theme Settings before rendering the Style Manager
   * so that we can change fields before subscribing to GJS events.
   * E.g. editor.on('style:custom', updatePropertyStyles);
   */
  const { themeSettings } = useThemeSettings(template.wtp_project_id);

  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const layerManagerIsOpen = useLayerManagerStore((store) => store.isOpen);

  const init = async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _editor = await initEditor(template, themeSettings, pluginsDependencies, webasystSettings);
    initCommands(_editor);
  };

  useEffectOnce(() => {
    init();
  });

  return (
    <Grid
      templateAreas={`
        "header header header"
        "sidebar canvas layer"
        "sidebar breadcrumbs breadcrumbs"
      `}
      gridTemplateRows="54px 1fr 22px"
      gridTemplateColumns={`320px 1fr ${layerManagerIsOpen ? '320px' : '2px'}`}
      // Animating the appearance of the Layer Manager
      transition="0.3s"
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
      <GridItem area="layer">
        <LayerManager />
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
