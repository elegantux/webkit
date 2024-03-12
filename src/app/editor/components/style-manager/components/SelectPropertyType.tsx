import { memo } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { Select } from '@ui/atomic/molecules';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { useStyleProperty } from '@app/editor/components/style-manager/lib/utils';

export const SelectProperty = memo(
  ({
    value,
    options,
    onChange,
  }: {
    value: SelectOptionProps | null;
    options: SelectOptionProps[] | undefined;
    onChange: (option: SelectOptionProps | any) => void;
  }) => {
    return (
      <Select
        menuPosition="fixed"
        menuPlacement="auto"
        value={value}
        options={options}
        onChange={onChange}
      />
    );
  }
);

export const SelectPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const { value, hasInheritedValue, clearProperty, propertyLabel, propertyOptions } = useStyleProperty(property);

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
        onClear={clearProperty}
      />
      {propertyOptions ? (
        <SelectProperty
          value={selectedValue}
          options={propertyOptions}
          onChange={handleInputChange}
        />
      ) : (
        <Text>Property options are not defined</Text>
      )}
    </Flex>
  );
});
