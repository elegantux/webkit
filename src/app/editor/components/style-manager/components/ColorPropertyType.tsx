import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ColorResult, HsvaColor, hsvaToHsvaString } from '@uiw/color-convert';
import Sketch from '@uiw/react-color-sketch';
import { FaEyeDropper as ColorPickerIcon } from 'react-icons/fa6';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { hexOpacity } from '@ui/theme/utils';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { debounce } from '@lib/utils';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';

export const getPropertyInitialValue = (property: ExtendedProperty) =>
  property.hasValue() ? (property.getValue() as string) : '';

const pickerColorToString = (color: string | HsvaColor) =>
  typeof color === 'string' ? color : hsvaToHsvaString(color);

export const hasValueParent = (property: ExtendedProperty) => {
  const parent = property.getParent();
  return property.hasValueParent() && (parent ? parent.isDetached() : true);
};

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
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  // const hasInheritedValue = hasValueParent(property);
  const [value, setValue] = useState<string>('');
  const [displayColor, setDisplayColor] = useState<string>('');

  const propertyLabel = useMemo(() => property.getLabel(), []);
  const hasColor = value.length > 0;

  // Debounce updating the display color
  const updateDisplayColor = useMemo(() => debounce(setDisplayColor, 50), []);

  const theme = useTheme();
  const iconColor = useColorModeValue(theme.colors.grey[300], theme.colors.grey[900]);
  const bgColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.05),
    hexOpacity(theme.colors.grey[50], 0.1)
  );

  const handleInputChange = useCallback((color: ColorResult) => {
    property.upValue(color.hexa);
    setValue(color.hexa);
    updateDisplayColor(color.hexa);
  }, []);

  const handleClearButton = () => {
    property.clear();
    setValue('');
    updateDisplayColor('');
  };

  const onStyleChange = useCallback(() => {
    // console.log('onStyleChange');
    const lastSelectedComponent = editor.getSelected();
    const color = lastSelectedComponent?.getStyle(property.getName());
    if (typeof color === 'string') {
      setValue(pickerColorToString(color));
      updateDisplayColor(pickerColorToString(color));
    } else {
      setValue('');
      updateDisplayColor('');
    }
  }, [value]);

  // Update state when:
  // 1. selected component is changed
  // 2. undo/redo fired
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_STYLE_MANAGER_PROPERTY}`, onStyleChange);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_STYLE_MANAGER_PROPERTY}`, onStyleChange);
    };
  }, [editor]);

  return (
    <Flex direction="column">
      <PropertyHeader
        propertyLabel={propertyLabel}
        hasInheritedValue={false}
        hasValue={!!value}
        onClear={handleClearButton}
      />
      <Popover
        isLazy
        lazyBehavior="unmount"
      >
        <PopoverTrigger>
          <Button
            width="100%"
            bgColor={hasColor ? displayColor : bgColor}
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
    </Flex>
  );
});
