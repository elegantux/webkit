// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'zustand';
import grapesjs, { Editor, EditorConfig, Sector } from 'grapesjs';

export const EDITOR_STORE = {
  EDITOR: (state: EditorInterface) => state.editor,
  INIT: (state: EditorInterface) => state.init,
  SECTOR_LIST: (state: StyleManagerSectorsInterface) => state.sectorList,
  SET_SECTOR_LIST: (state: StyleManagerSectorsInterface) => state.setSectorList,
};

interface EditorInterface {
  editor: Editor;
  init: (config: EditorConfig) => Editor;
}

export const useEditorStore = create<EditorInterface>((set) => ({
  // @ts-ignore
  editor: null,
  init: (config) => {
    const editor = grapesjs.init(config);
    set(() => ({ editor }));
    return editor;
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
