import { Trait } from 'grapesjs';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { debounce } from '@lib/utils';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { CodeEditor } from '@ui/atomic/molecules';
import { useTraitProperty } from '@app/editor/components/trait-manager/lib/utils';

export function CodeEditorTrait({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, clearTraitValue, traitDefaultValue, traitLabel } = useTraitProperty(
    trait,
    trait.getValue()
  );
  const [codeEditor, setCodeEditor] = useState<Record<any, any> | null>(null);

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => debounce(updateTraitValue, 500), [trait]);

  const handleInputChange = (v: string) => {
    debouncedUpdateTraitValue(v);
    setValue(v);
  };

  const handleClearButton = () => {
    clearTraitValue();
    codeEditor?.setValue(traitDefaultValue);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.id}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <CodeEditor
        key={trait.id}
        value={value}
        onChange={handleInputChange}
        codeEditor={codeEditor}
        setCodeEditor={setCodeEditor}
      />
    </Box>
  );
}
