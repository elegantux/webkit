import { Box, ChakraProps, Flex, Spinner, Text } from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

export function Canvas(props: ChakraProps) {
  const arePluginsLoaded = useEditorStore(EDITOR_STORE.EDITOR_ARE_PLUGINS_LOADED);

  return (
    <Box {...props}>
      <Box
        id="editor-container"
        display={arePluginsLoaded ? 'block' : 'none'}
      />
      {!arePluginsLoaded && (
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="24px"
          width="full"
          height="full"
        >
          <Spinner size="xl" />
          <Text>Loading components ...</Text>
        </Flex>
      )}
    </Box>
  );
}
