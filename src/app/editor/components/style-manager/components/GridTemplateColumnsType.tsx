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
  const { value, hasInheritedValue, clearProperty, propertyLabel } = useStyleProperty(property, {
    validateValue: (propertyValue) => {
      const columns = parseGridTemplateColumns(propertyValue);
      return columns ? String(columns.columns) : '';
    },
  });

  const handleInputChange = (valueAsString: string) => {
    property.upValue(objectToGridTemplateColumns({ columns: Number(valueAsString), width: '1fr' }));
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
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
});
