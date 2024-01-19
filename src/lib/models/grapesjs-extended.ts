import { Property } from 'grapesjs';

import { SelectOptionProps } from '@ui/atomic/molecules/Select';

export type ExtendedProperty = Property<{
  options?: SelectOptionProps[];
  units?: string[];
  colSpan?: number;
}>;
