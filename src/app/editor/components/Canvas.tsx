import {
  Box,
  Button,
  ChakraProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

export function Canvas(props: ChakraProps) {
  const disclosure = useDisclosure({ defaultIsOpen: false });
  const arePluginsLoaded = useEditorStore(EDITOR_STORE.EDITOR_ARE_PLUGINS_LOADED);

  return (
    <Box {...props}>
      {/* <Button onClick={disclosure.onOpen}>Open</Button> */}
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
      <Drawer
        isOpen={disclosure.isOpen}
        placement="left"
        onClose={disclosure.onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>
          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={disclosure.onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
