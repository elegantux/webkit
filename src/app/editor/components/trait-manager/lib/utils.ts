import { Trait } from 'grapesjs';
import { useCallback, useMemo, useState } from 'react';

import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';

export function useTraitProperty<DataType>(trait: Trait, defaultValue: DataType) {
  const [value, setValue] = useState<DataType>(defaultValue);

  const traitProps = useMemo(
    () => ({
      traitName: trait.getName(),
      traitLabel: trait.getLabel(),
      traitDefaultValue: trait.getDefault() ?? '',
      traitPlaceholder: trait.attributes?.placeholder ?? '',
      traitText: trait.get('text'),
      // @ts-ignore
      traitDescription: trait.get('description') as string | undefined,
      // @ts-ignore
      traitDebounce: trait.get('debounce') ?? 0,
      // Input props
      traitMinValue: trait.attributes?.min,
      traitMaxValue: trait.attributes?.max,
      traitStep: trait.attributes?.step,
      traitOptions: trait
        .getOptions()
        // The trait option type in GrapesJS has "id" and "label" keys, but we use the "value" key instead of "id".
        // @ts-ignore
        ?.map((option) => ({ value: option.value, label: option.label })) as SelectOptionProps[],
    }),
    [trait]
  );

  const updateTraitValue = useCallback(
    (v: DataType) => {
      trait.setValue(v);
    },
    [trait]
  );

  const clearTraitValue = () => {
    updateTraitValue(traitProps.traitDefaultValue);
    setValue(traitProps.traitDefaultValue);
  };

  return {
    value,
    setValue,
    updateTraitValue,
    clearTraitValue,
    ...traitProps,
  };
}
