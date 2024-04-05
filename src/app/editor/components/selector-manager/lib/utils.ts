import { Selector, State } from 'grapesjs';
import { create } from 'zustand';

interface SelectorManagerStoreInterface {
  selectors: Selector[];
  states: State[];
  state: State | undefined;
  targets: string;
  setState: (payload: Omit<SelectorManagerStoreInterface, 'setState'>) => void;
}
export const useSelectorManagerStore = create<SelectorManagerStoreInterface>((set) => ({
  selectors: [],
  states: [],
  state: undefined,
  targets: '',
  setState: (payload: Omit<SelectorManagerStoreInterface, 'setState'>) => {
    set(() => ({ ...payload }));
  },
}));
