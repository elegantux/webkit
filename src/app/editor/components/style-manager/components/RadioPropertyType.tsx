import { ButtonGroup, Flex, IconButton, Text, Tooltip, useColorModeValue, useTheme } from '@chakra-ui/react';
import { memo } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { hexOpacity } from '@ui/theme/utils';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { useStyleProperty } from '@app/editor/components/style-manager/lib/utils';

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const RadioPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const { value, hasInheritedValue, clearProperty, propertyLabel, propertyOptions } = useStyleProperty(property);

  const theme = useTheme();
  const color = useColorModeValue('grey.900', 'grey.300');
  const activeColor = useColorModeValue('dodger.500', 'dodger.200');
  const bgColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.05),
    hexOpacity(theme.colors.grey[50], 0.1)
  );
  const activeBgColor = useColorModeValue(theme.colors.dodger[100], hexOpacity(theme.colors.dodger[50], 0.3));
  const borderColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.2),
    hexOpacity(theme.colors.grey[50], 0.2)
  );
  const focusedBorderColor = useColorModeValue(hexOpacity(theme.colors.stratos[500], 0.2), theme.colors.dodger[500]);

  const onChange = (v: SelectOptionProps['value']) => {
    if (typeof v === 'string') {
      property.upValue(v);
    }
  };

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={!!value}
        onClear={clearProperty}
      />
      {propertyOptions ? (
        <ButtonGroup
          size="sm"
          variant="outline"
          isAttached
        >
          {propertyOptions.map((option) => (
            <Tooltip
              hasArrow
              key={option.value}
              label={option.label}
            >
              <IconButton
                aria-label=""
                onClick={() => onChange(option.value)}
                icon={option.icon?.({ size: '18px' }) ?? <Text>{option.value}</Text>}
                color={value === option.value ? activeColor : color}
                flex={1}
                borderColor="transparent"
                backgroundColor={value === option.value ? activeBgColor : bgColor}
                _groupHover={{ borderColor: value === option.value ? focusedBorderColor : borderColor }}
              />
            </Tooltip>
          ))}
        </ButtonGroup>
      ) : (
        <Text>Property options are not defined</Text>
      )}
    </Flex>
  );
});
