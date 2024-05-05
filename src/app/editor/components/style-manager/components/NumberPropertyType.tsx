import {
  Flex,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tooltip,
} from '@chakra-ui/react';
import { memo } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { useDraggableValue, useStyleProperty } from '@app/editor/components/style-manager/lib/utils';
import { ClearValueButton } from '@app/editor/components/style-manager/components/ClearValueButton';

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const NumberPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const { value, hasInheritedValue, leftAddon, clearProperty, propertyLabel } = useStyleProperty(property);

  // @ts-ignore
  const minValue: number | undefined = property.get('min');
  // @ts-ignore
  const maxValue: number | undefined = property.get('max');
  // @ts-ignore
  const step: number | undefined = property.get('step');

  const handleInputChange = (valueAsString: string) => {
    property.upValue(valueAsString);
  };

  const { ref: draggableRef } = useDraggableValue({
    value: Number(value),
    onChange: (v) => handleInputChange(String(v)),
  });

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={!!value}
      />
      <InputGroup
        variant="style-text"
        size="sm"
        {...(value ? { className: `active ${hasInheritedValue ? 'inherit' : ''}` } : {})}
      >
        {leftAddon && (
          <Tooltip
            label={propertyLabel}
            hasArrow
          >
            <InputLeftAddon ref={draggableRef}>{leftAddon}</InputLeftAddon>
          </Tooltip>
        )}
        <NumberInput
          size="sm"
          variant="style-number"
          value={value}
          onChange={handleInputChange}
          {...(minValue ? { min: minValue } : {})}
          {...(maxValue ? { max: maxValue } : {})}
          {...(step ? { step } : {})}
          {...(value.length > 0 ? { className: `active ${hasInheritedValue ? 'inherit' : ''}` } : {})}
        >
          <NumberInputField value={value} />
          <Flex
            position="absolute"
            top={0}
            right={0}
            height="full"
            gap="2px"
            align="center"
          >
            <NumberInputStepper position="relative">
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
            {!!value && (
              <ClearValueButton
                variant="unit"
                color="grey.400"
                onClick={clearProperty}
                mr="3px !important"
              />
            )}
          </Flex>
        </NumberInput>
      </InputGroup>
    </Flex>
  );
});
