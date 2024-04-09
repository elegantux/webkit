import { create } from 'zustand';
import { UseDisclosureReturn } from '@chakra-ui/react';

interface LayerManagerStoreInterface
  extends Omit<UseDisclosureReturn, 'isControlled' | 'getButtonProps' | 'getDisclosureProps'> {}
export const useLayerManagerStore = create<LayerManagerStoreInterface>((set) => ({
  isOpen: false,
  onOpen: () => {
    set(() => ({ isOpen: true }));
  },
  onClose: () => {
    set(() => ({ isOpen: false }));
  },
  onToggle: () => {
    set((prevStore) => ({ isOpen: !prevStore.isOpen }));
  },
}));
