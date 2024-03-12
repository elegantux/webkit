import { Trait } from 'grapesjs';
import { Box, Button } from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';

export function ButtonTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const traitLabel = trait.getLabel();
  const traitButtonText = trait.get('text') ?? '';
  // @ts-ignore
  const traitDescription: string | undefined = trait.get('description') ?? '';

  const handleButtonClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    const command = trait.get('command');
    if (typeof command === 'string') {
      return editor.Commands.run(command);
    }
    return command?.(editor, trait);
  };

  return (
    <Box key={trait.getId()}>
      <PropertyHeader propertyLabel={traitLabel} />
      <Button onClick={handleButtonClick}>{traitButtonText}</Button>
      {traitDescription && <Box dangerouslySetInnerHTML={{ __html: traitDescription }} />}
    </Box>
  );
}
