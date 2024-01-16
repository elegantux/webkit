// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'zustand';
import grapesjs, { Editor, EditorConfig } from 'grapesjs';

export const EDITOR_STORE = {
  EDITOR: (state: EditorInterface) => state.editor,
  INIT: (state: EditorInterface) => state.init,
};

interface EditorInterface {
  editor: Editor;
  init: (config: EditorConfig) => void;
}

export const useEditorStore = create<EditorInterface>((set) => ({
  // @ts-ignore
  editor: null,
  init: (config) => {
    const editor = grapesjs.init(config);
    set(() => ({ editor }));
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
