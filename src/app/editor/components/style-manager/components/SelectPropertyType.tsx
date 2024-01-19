import { Flex } from '@chakra-ui/react';
import { memo, useEffect, useMemo, useState } from 'react';

import { Select } from '@ui/atomic/molecules';
import { SelectOptionProps } from '@ui/atomic/molecules/Select';
import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const hasValueParent = (property: ExtendedProperty) => {
  const parent = property.getParent();
  return property.hasValueParent() && (parent ? parent.isDetached() : true);
};

export const SelectPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>('');

  const propertyLabel = useMemo(() => property.getLabel(), []);
  const hasValue = value.length > 0;

  // const initialValue = getPropertyInitialValue(property);
  const selectedValue = property.attributes.options!.find((option) => option.value === value) ?? null;
  const options = property.attributes.options!;

  const handleInputChange = (option: SelectOptionProps | any) => {
    if (option) {
      property.upValue(option.value);
    } else {
      property.upValue('');
    }
  };

  const handleClearButton = () => {
    property.clear();
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
        hasValue={hasValue}
        onClear={handleClearButton}
      />
      <Select
        menuPosition="fixed"
        menuPlacement="auto"
        value={selectedValue}
        options={options}
        onChange={handleInputChange}
      />
    </Flex>
  );
});
