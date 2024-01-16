import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  useDisclosure,
} from '@chakra-ui/react';

export function Canvas() {
  const disclosure = useDisclosure({ defaultIsOpen: false });

  return (
    <>
      {/* <Button onClick={disclosure.onOpen}>Open</Button> */}
      <div id="editor-container" />
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
    </>
  );
}
