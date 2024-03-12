import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { getPropertyValue, propertyHasParentValue } from '@app/editor/lib/utils';

export const useStyleProperty = (
  property: ExtendedProperty,
  {
    validateValue,
    onStyleChange,
    onSelectorChange,
  }: {
    validateValue?: (propertyValue: string) => string;
    onStyleChange?: (propertyValue: string) => void;
    onSelectorChange?: () => void;
  } = {}
) => {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const [value, setValue] = useState<string>('');
  const [hasInheritedValue, setHasInheritedValue] = useState<boolean>(propertyHasParentValue(property));

  const propertyProps = useMemo(
    () => ({
      propertyLabel: property.getLabel(),
      propertyUnits: property.get('units'),
      propertyOptions: property.get('options'),
    }),
    [property]
  );

  const clearProperty = () => {
    property.clear();
    setValue('');
  };

  // const onPropertyStylesChange = () => {
  //   const propertyValue = getPropertyValue(property);
  //   setValue(propertyValue);
  // };

  // Send this callback out of stack
  const updatePropertyStyles = useCallback(async () => {
    const propertyValue = getPropertyValue(property);

    if (onStyleChange) {
      onStyleChange(propertyValue);
    }

    // if (propertyProps.propertyLabel === 'Color') {
    //   console.log(
    //     `[ID: ${editor.getSelected()?.getId()}][${editor.getSelected()?.getName()}]: ${
    //       propertyProps.propertyLabel
    //     } - value`,
    //     propertyValue,
    //     property.getValue()
    //   );
    // }

    if (validateValue) {
      const validatedValue = validateValue(propertyValue);
      setValue(validatedValue);
    } else {
      setValue(propertyValue);
    }

    setHasInheritedValue(propertyHasParentValue(property));
  }, [property, onSelectorChange]);

  // Send this callback out of stack
  const handleSelectorChange = useCallback(async () => {
    if (onSelectorChange) {
      onSelectorChange();
    }
    setHasInheritedValue(propertyHasParentValue(property));
  }, []);

  useEffect(() => {
    editor.on('style:custom', updatePropertyStyles);
    editor.on('selector:custom', handleSelectorChange);

    return () => {
      editor.off('style:custom', updatePropertyStyles);
      editor.off('selector:custom', handleSelectorChange);
    };
  }, [editor]);

  return {
    value,
    hasInheritedValue,
    clearProperty,
    ...propertyProps,
  };
};
