import { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { getBlockMedia } from '@app/editor/lib/utils';

export function SelectedComponentLabel() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const selectedComponent = editor.getSelected();
  const componentBlock = useMemo(
    () => editor.BlockManager.get(selectedComponent?.get('type') ?? ''),
    [selectedComponent]
  );
  const componentIcon = componentBlock ? getBlockMedia(componentBlock) : null;

  return (
    <Flex
      align="center"
      gap="8px"
      color="dodger.600"
    >
      <Box
        width="24px"
        height="24px"
        sx={{
          '& svg, & img': {
            height: '100%',
          },
        }}
      >
        {componentIcon ?? (
          <svg
            width="100%"
            height="42px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 18L21 12L16 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6L3 12L8 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="8.53015"
              y1="20.829"
              x2="14.6865"
              y2="3.91452"
              stroke="currentColor"
            />
          </svg>
        )}
      </Box>
      <Text
        fontSize="sm"
        fontWeight="500"
      >
        {selectedComponent?.getName()}
      </Text>
    </Flex>
  );
}
