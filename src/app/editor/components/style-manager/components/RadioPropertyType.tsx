import { ButtonGroup, Flex, IconButton, Text, Tooltip, useColorModeValue, useTheme } from '@chakra-ui/react';
import { memo, useEffect, useMemo, useState } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { SelectOptionProps } from '@ui/atomic/molecules/Select';
import { hexOpacity } from '@ui/theme/utils';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const hasValueParent = (property: ExtendedProperty) => {
  const parent = property.getParent();
  return property.hasValueParent() && (parent ? parent.isDetached() : true);
};

export const RadioPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>('');

  const propertyLabel = useMemo(() => property.getLabel(), []);

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

  const options = property.attributes.options!;

  const onChange = (v: SelectOptionProps['value']) => {
    if (typeof v === 'string') {
      property.upValue(v);
      setValue(v);
    }
  };

  const handleClearButton = () => {
    property.clear();
    setValue('');
  };

  const onStyleChange = () => {
    const lastSelectedComponent = editor.getSelected();
    const propertyValue = lastSelectedComponent?.getStyle(property.getName());
    if (typeof propertyValue === 'string') {
      setValue(propertyValue);
    } else {
      setValue('');
    }
  };

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
      <ButtonGroup
        size="md"
        variant="outline"
        isAttached
      >
        {options.map((option) => (
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
    </Flex>
  );
});
