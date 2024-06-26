import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { ColorResult, HsvaColor, hsvaToHsvaString } from '@uiw/color-convert';
import Sketch from '@uiw/react-color-sketch';
import { FaEyeDropper as ColorPickerIcon } from 'react-icons/fa6';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { hexOpacity } from '@ui/theme/utils';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { debounce } from '@lib/utils';
import { useStyleProperty } from '@app/editor/components/style-manager/lib/utils';
import { ClearValueButton } from '@app/editor/components/style-manager/components/ClearValueButton';

const pickerColorToString = (color: string | HsvaColor) =>
  typeof color === 'string' ? color : hsvaToHsvaString(color);

export const ColorPicker = memo(
  ({ color, onChange }: { color: string; onChange?: (newShade: ColorResult) => void }) => {
    const theme = useTheme();
    const hasColor = color.length > 0;

    return (
      <Sketch
        color={hasColor ? color : theme.colors.dodger[500]}
        onChange={onChange}
      />
    );
  }
);

export const ColorPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const [displayColor, setDisplayColor] = useState<string>('');
  // Debounce updating the display color
  const updateDisplayColor = useMemo(() => debounce(setDisplayColor, 50), []);

  const { value, hasInheritedValue, clearProperty, propertyLabel } = useStyleProperty(property, {
    validateValue: (propertyValue) => {
      const color = pickerColorToString(propertyValue);
      updateDisplayColor(color);
      return color;
    },
  });

  const hasColor = value.length > 0;

  const theme = useTheme();
  const iconColor = useColorModeValue(theme.colors.grey[300], theme.colors.grey[500]);
  const bgColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.05),
    hexOpacity(theme.colors.grey[50], 0.1)
  );

  const handleInputChange = useCallback((color: ColorResult) => {
    /**
     * We may have to use opts.partial=true to avoid passing the color to UndoManager every time it changes.
     * It makes sense to add a 1-second debounce timer to update the value without opts.partial=true.
     */
    property.upValue(color.hexa);
    updateDisplayColor(color.hexa);
  }, []);

  const handleClearButton = () => {
    clearProperty();
    updateDisplayColor('');
  };

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={hasInheritedValue}
        hasValue={!!value}
      />
      <Flex>
        <InputGroup
          variant="style-text"
          size="sm"
          zIndex={1}
          {...(value.length > 0 ? { className: `active ${hasInheritedValue ? 'inherit' : ''}` } : {})}
        >
          <InputLeftAddon p={0}>
            <Popover
              isLazy
              lazyBehavior="unmount"
              // placement="top"
            >
              <PopoverTrigger>
                <Button
                  minW="34px"
                  height="100%"
                  padding="0"
                  mr={0}
                  borderRadius="3px"
                  bgColor={hasColor ? displayColor : 'transparent'}
                  _hover={{ bgColor: hasColor ? displayColor : bgColor }}
                >
                  {!hasColor && <ColorPickerIcon color={iconColor} />}
                </Button>
              </PopoverTrigger>
              <PopoverContent width="auto">
                <PopoverArrow p={2} />
                <PopoverBody p="1px">
                  <ColorPicker
                    color={value}
                    onChange={handleInputChange}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </InputLeftAddon>
          <Input
            type="text"
            textAlign="left"
            defaultValue={value}
            mr="0 !important"
          />
          <Box
            position="absolute"
            top="5px"
            right="4px"
          >
            {value.length > 0 && (
              <ClearValueButton
                variant="unit"
                color="grey.400"
                onClick={handleClearButton}
              />
            )}
          </Box>
        </InputGroup>
      </Flex>
    </Flex>
  );
});
