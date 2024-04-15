import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { memo } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { useStyleProperty } from '@app/editor/components/style-manager/lib/utils';

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const NumberPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const { value, hasInheritedValue, clearProperty, propertyLabel } = useStyleProperty(property);

  // @ts-ignore
  const minValue: number | undefined = property.get('min');
  // @ts-ignore
  const maxValue: number | undefined = property.get('max');
  // @ts-ignore
  const step: number | undefined = property.get('step');

  const handleInputChange = (valueAsString: string) => {
    property.upValue(valueAsString);
  };

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={!!value}
        onClear={clearProperty}
      />
      <NumberInput
        size="sm"
        value={value}
        onChange={handleInputChange}
        {...(minValue ? { min: minValue } : {})}
        {...(maxValue ? { max: maxValue } : {})}
        {...(step ? { step } : {})}
      >
        <NumberInputField value={value} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
});
