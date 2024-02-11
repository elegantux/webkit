import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaComputerMouse as ComputerMouseIcon, FaCirclePlus } from 'react-icons/fa6';
import { Component } from 'grapesjs';

import { TraitManager } from '@app/editor/components/manager/TraitManager';
import { BlockManager } from '@app/editor/components/manager/BlockManager';
import { StyleManager } from '@app/editor/components/style-manager/StyleManager';
import { EDITOR_STORE, useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { SelectorManager } from '@app/editor/components/manager/SelectorManager';

export function Sidebar() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<Component | undefined>(undefined);
  const disclosure = useBlockListDisclosure((state) => state);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const showTabs = !!selectedComponent && selectedComponent?.get('type') !== 'wrapper';

  const handleComponentChange = () => {
    console.log('Sidebar -> handleComponentChange');
    setSelectedComponent(editor.getSelected());
  };

  useEffect(() => {
    editor.on('component:selected', handleComponentChange);
    editor.on('component:deselected', handleComponentChange);
    editor.on('component:remove', handleComponentChange);

    return () => {
      editor.off('component:selected', handleComponentChange);
      editor.off('component:deselected', handleComponentChange);
      editor.off('component:remove', handleComponentChange);
    };
  }, []);

  return (
    <>
      {showTabs ? (
        <Tabs
          tabIndex={tabIndex}
          onChange={setTabIndex}
          borderRight="2px solid"
          borderRightColor="var(--chakra-colors-chakra-border-color)"
          minH="100%"
          lazyBehavior="unmount"
          isLazy
        >
          <TabList
            position="sticky"
            top={0}
            zIndex={2}
            bgColor="var(--chakra-colors-chakra-body-bg)"
            gap={0}
          >
            <Tab
              as={Button}
              variant="ghost"
              py="12px"
              flex={1}
              mr={0}
              borderRadius={0}
              borderWidth={0}
              borderBottom="2px"
              borderColor="transparent"
            >
              Styles
            </Tab>
            <Tab
              as={Button}
              variant="ghost"
              py="12px"
              flex={1}
              borderRadius={0}
              borderWidth={0}
              borderBottom="2px"
              borderColor="transparent"
            >
              Settings
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <SelectorManager />
              <StyleManager />
            </TabPanel>
            <TabPanel p={0}>
              <TraitManager />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="64px"
          height="100%"
          borderRight="2px solid"
          borderRightColor="var(--chakra-colors-chakra-border-color)"
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            gap="24px"
          >
            <Text
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            >
              Select component
            </Text>
            <ComputerMouseIcon size={42} />
          </Flex>
          <Box
            position="relative"
            width="100%"
          >
            <Divider borderColor="grey.500" />
            <AbsoluteCenter
              bg="grey.400"
              px="4"
              top="0"
              borderRadius={4}
            >
              or
            </AbsoluteCenter>
          </Box>
          <Button
            colorScheme="dodger"
            size="sm"
            onClick={disclosure.onOpen}
            leftIcon={<FaCirclePlus size={20} />}
            iconSpacing="6px"
          >
            Add Block
          </Button>
        </Flex>
      )}
      <Drawer
        variant="sidebar"
        placement="left"
        onClose={disclosure.onClose}
        isOpen={disclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            px="16px"
            borderBottomWidth="1px"
          >
            Block List
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0}>
            <BlockManager />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
