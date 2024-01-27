import { Property } from 'grapesjs';

import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';

export type ExtendedProperty = Property<{
  options?: SelectOptionProps[];
  units?: string[];
  colSpan?: number;
}>;
