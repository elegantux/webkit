import { memo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ClearIndicatorProps, components } from 'react-select';

import { Select } from '@ui/atomic/molecules';
import { SELECT_VARIANTS, SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { useStyleProperty } from '@app/editor/components/style-manager/lib/utils';
import { ClearValueButton } from '@app/editor/components/style-manager/components/ClearValueButton';

function ClearIndicatorRenderer(props: ClearIndicatorProps) {
  const { getValue } = props;
  const firstChip = getValue()[0] as any;
  const isFirstChipNotEmpty = firstChip?.value && String(firstChip.value)?.trim()?.length > 0;

  if (isFirstChipNotEmpty) {
    return (
      <components.ClearIndicator {...props}>
        <ClearValueButton
          variant="unit"
          color="grey.400"
        />
      </components.ClearIndicator>
    );
  }

  return null;
}

export const SelectProperty = memo(
  ({
    value,
    options,
    onChange,
    hasInheritedValue,
  }: {
    value: SelectOptionProps | null;
    options: SelectOptionProps[] | undefined;
    onChange: (option: SelectOptionProps | any) => void;
    hasInheritedValue?: boolean;
  }) => {
    return (
      <Select
        variant={SELECT_VARIANTS.STYLE_MANAGER}
        menuPosition="fixed"
        menuPlacement="auto"
        value={value}
        options={options}
        onChange={onChange}
        ClearIndicator={ClearIndicatorRenderer}
        isClearable
        {...(hasInheritedValue ? { className: 'inherit' } : {})}
      />
    );
  }
);

export const SelectPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const { value, hasInheritedValue, propertyLabel, propertyOptions } = useStyleProperty(property);

  const hasValue = value.length > 0;

  const selectedValue = propertyOptions!.find((option) => option.value === value) ?? null;

  const handleInputChange = (option: SelectOptionProps | any) => {
    if (option) {
      property.upValue(option.value);
    } else {
      property.upValue('');
    }
  };

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={hasValue}
      />
      {propertyOptions ? (
        <SelectProperty
          value={selectedValue}
          options={propertyOptions}
          onChange={handleInputChange}
          hasInheritedValue={hasInheritedValue}
        />
      ) : (
        <Text>Property options are not defined</Text>
      )}
    </Flex>
  );
});
