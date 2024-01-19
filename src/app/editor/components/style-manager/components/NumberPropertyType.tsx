import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { memo, useEffect, useMemo, useState } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const NumberPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>('');

  const propertyLabel = useMemo(() => property.getLabel(), []);

  const handleInputChange = (valueAsString: string) => {
    property.upValue(valueAsString);
    setValue(valueAsString);
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
      <NumberInput
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
