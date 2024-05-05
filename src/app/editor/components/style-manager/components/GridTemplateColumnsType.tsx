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

type GridTemplateColumnsObject = {
  columns: number;
  width: string;
};

// Function to parse CSS grid template columns value into an object
const parseGridTemplateColumns = (cssValue: string): GridTemplateColumnsObject | null => {
  const regex = /repeat\((\d+), (\d*\.?\d+(?:fr|px|%|em|rem)?)\)/;
  const match = cssValue.match(regex);
  if (match) {
    const columns = parseInt(match[1], 10);
    const width = match[2];
    return {
      columns,
      width,
    };
  }
  return null;
};

// Function to convert an object to CSS grid template columns value
const objectToGridTemplateColumns = (obj: GridTemplateColumnsObject): string => {
  return `repeat(${obj.columns}, ${obj.width})`;
};

export const GridTemplateColumnsType = memo(({ property }: { property: ExtendedProperty }) => {
  const { value, hasInheritedValue, leftAddon, clearProperty, propertyLabel } = useStyleProperty(property, {
    validateValue: (propertyValue) => {
      const columns = parseGridTemplateColumns(propertyValue);
      return columns ? String(columns.columns) : '';
    },
  });

  const handleInputChange = (valueAsString: string) => {
    property.upValue(objectToGridTemplateColumns({ columns: Number(valueAsString), width: '1fr' }));
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
