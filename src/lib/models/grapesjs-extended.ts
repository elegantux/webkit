import { Block, Property } from 'grapesjs';

import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';

export type ExtendedProperty = Property<{
  options?: SelectOptionProps[];
  units?: string[];
  colSpan?: number;
  visible?: boolean;
}>;

export type ExtendedBlock = Block & {
  attributes: Block['attributes'] & { image?: string; icon?: string };
};
