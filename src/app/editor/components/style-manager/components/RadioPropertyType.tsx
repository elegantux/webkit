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
  const color = useColorModeValue('grey.800', 'grey.300');
  const activeColor = useColorModeValue('dodger.500', 'dodger.600');
  const borderColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.2),
    hexOpacity(theme.colors.grey[50], 0.2)
  );
  const focusedBorderColor = useColorModeValue(hexOpacity(theme.colors.stratos[500], 0.2), theme.colors.dodger[500]);

  const onChange = (v: SelectOptionProps['value']) => {
    if (typeof v === 'string') {
      if (v === value) {
        clearProperty();
      } else {
        property.upValue(v);
      }
    }
  };

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={!!value}
      />
      {propertyOptions ? (
        <ButtonGroup
          size="sm"
          variant="outline"
          isAttached
          borderWidth="1px"
          borderColor="grey.100"
          rounded="4px"
          {...(value.length > 0 ? { className: `active ${hasInheritedValue ? 'inherit' : ''}` } : {})}
          sx={{
            '&.active': {
              borderColor: 'dodger.600 !important',
            },
            '&.inherit': {
              borderColor: 'green.500 !important',
            },
            _dark: {
              borderColor: 'ebony.500',
              '&.active': {
                borderColor: 'dodger.700 !important',
              },
              '&.inherit': {
                borderColor: 'green.200 !important',
              },
            },
          }}
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
                rounded="4px"
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
