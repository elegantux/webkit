import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { getPropertyValue, propertyHasParentValue } from '@app/editor/lib/utils';
import { RESIZE_CURSOR_SELECTOR_ID } from '@app/editor/components/style-manager/components/ResizeCursor';

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
      leftAddon: property.get('leftAddon'),
      hideLabel: property.get('hideLabel'),
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

export const useDraggableValue = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const cursor = document.querySelector(`#${RESIZE_CURSOR_SELECTOR_ID}`);

  // This captures the starting position of the cursor
  const [startX, setStartX] = useState(0);
  // Snapshot of the value when the drag starts
  const [startValue, setStartValue] = useState(value);

  // Start the drag to change operation when the mouse button is down
  const onStart = useCallback(
    (event: MouseEvent) => {
      setStartX(event.clientX);
      setStartValue(value); // Capture the initial value at the start of the drag
    },
    [value]
  );

  useEffect(() => {
    const onUpdate = (event: MouseEvent) => {
      if (startX !== 0) {
        // Calculate new value based on the difference in cursor position
        const diff = event.clientX - startX;
        onChange(startValue + diff); // Adjust value based on the initial value and the diff

        if (cursor) {
          cursor.setAttribute('style', `display: block; top: ${event.pageY - 18}px; left: ${event.pageX - 14}px;`);
        }
      }
    };

    const onEnd = () => {
      setStartX(0); // Reset startX when dragging ends

      if (cursor) {
        cursor.setAttribute('style', 'display: none; top: 0; left: 0;');
      }
    };

    // Add event listeners
    if (ref.current) {
      ref.current.addEventListener('mousedown', onStart);
    }
    document.addEventListener('mousemove', onUpdate);
    document.addEventListener('mouseup', onEnd);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousedown', onStart);
      }
      document.removeEventListener('mousemove', onUpdate);
      document.removeEventListener('mouseup', onEnd);
    };
  }, [startX, startValue, onChange, onStart]);

  return {
    ref,
  };
};
