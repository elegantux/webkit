import { Trait } from 'grapesjs';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { debounce } from '@lib/utils';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { CodeEditor } from '@ui/atomic/molecules';

export function CodeEditorTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>(trait.getValue());
  const [codeEditor, setCodeEditor] = useState<Record<any, any> | null>(null);

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? '';

  const updateTraitValue = (v: string) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => {
    if (component) {
      return debounce(updateTraitValue, 500);
    }
    return () => {};
  }, [component]);

  const handleInputChange = (v: string) => {
    debouncedUpdateTraitValue(v);
    setValue(v);
  };

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValue(traitDefaultValue);
    codeEditor?.setValue(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    if (typeof traitValue === 'string') {
      setValue(traitValue);
    } else {
      setValue('');
    }
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <CodeEditor
        key={component?.getId()}
        value={value}
        onChange={handleInputChange}
        codeEditor={codeEditor}
        setCodeEditor={setCodeEditor}
      />
    </Box>
  );
}
