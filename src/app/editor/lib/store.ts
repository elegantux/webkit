// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'zustand';
import grapesjs, { Editor, EditorConfig, Sector, Selector, State } from 'grapesjs';

import { RuleManagerToggleSidebarCommandPayload } from '@lib/models/commands';

export const EDITOR_STORE = {
  EDITOR: (state: EditorInterface) => state.editor,
  EDITOR_ARE_PLUGINS_LOADED: (state: EditorInterface) => state.arePluginsLoaded,
  EDITOR_SET_ARE_PLUGINS_LOADED: (state: EditorInterface) => state.setArePluginsLoaded,
  INIT: (state: EditorInterface) => state.init,
  SECTOR_LIST: (state: StyleManagerSectorsInterface) => state.sectorList,
  SET_SECTOR_LIST: (state: StyleManagerSectorsInterface) => state.setSectorList,
};

interface EditorInterface {
  editor: Editor;
  init: (config: EditorConfig) => Editor;
  arePluginsLoaded: boolean;
  setArePluginsLoaded: (bool: boolean) => void;
}

export const useEditorStore = create<EditorInterface>((set) => ({
  // @ts-ignore
  editor: null,
  init: (config) => {
    const editor = grapesjs.init(config);
    set(() => ({ editor }));
    return editor;
  },
  arePluginsLoaded: false,
  setArePluginsLoaded: (bool: boolean) => {
    set((state) => ({ ...state, arePluginsLoaded: bool }));
  },
}));

interface StyleManagerSectorsInterface {
  sectorList: Sector[];
  setSectorList: (sectors: Sector[]) => void;
}
export const useStyleManagerSectorsStore = create<StyleManagerSectorsInterface>((set) => ({
  sectorList: [],
  setSectorList: (sectors: Sector[]) => {
    set(() => ({ sectorList: sectors }));
  },
}));

interface RuleManagerStoreInterface extends RuleManagerToggleSidebarCommandPayload {
  setState: (payload: RuleManagerToggleSidebarCommandPayload) => void;
  reset: () => void;
}
export const useRuleManagerStore = create<RuleManagerStoreInterface>((set) => ({
  component: undefined,
  selector: undefined,
  cssRule: undefined,
  setState: (payload: RuleManagerToggleSidebarCommandPayload) => {
    set(() => ({ ...payload }));
  },
  reset: () => set(() => ({})),
}));

// This hook allows you to manage the Block List popup from anywhere in the application.
export const useBlockListDisclosure = create<{
  tabIndex: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setTabIndex: (tabIndex: number) => void;
}>((set) => ({
  tabIndex: 0,
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
  onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setTabIndex: (tabIndex: number) => set(() => ({ tabIndex })),
}));

// This hook allows you to manage the Rule Manager popup from anywhere in the application.
export const useRuleManagerDisclosure = create<{
  tabIndex: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setTabIndex: (tabIndex: number) => void;
}>((set) => ({
  tabIndex: 0,
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
  onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setTabIndex: (tabIndex: number) => set(() => ({ tabIndex })),
}));
