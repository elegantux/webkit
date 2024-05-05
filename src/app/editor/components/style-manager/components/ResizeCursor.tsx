import { Box } from '@chakra-ui/react';

export const RESIZE_CURSOR_SELECTOR_ID = 'sm_resize_cursor';

export function ResizeCursor() {
  return (
    <Box
      id={RESIZE_CURSOR_SELECTOR_ID}
      display="none"
      w="32px"
      h="32px"
      position="fixed"
      zIndex={101}
      cursor="ew-resize"
    />
  );
}
