import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaComputerMouse as ComputerMouseIcon, FaCirclePlus } from 'react-icons/fa6';
import { Component } from 'grapesjs';
import { useTranslation } from 'react-i18next';

import { TraitManager } from '@app/editor/components/trait-manager/TraitManager';
import { BlockManager } from '@app/editor/components/manager/BlockManager';
import { StyleManager } from '@app/editor/components/style-manager/StyleManager';
import { EDITOR_STORE, useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { SelectorManager } from '@app/editor/components/selector-manager/SelectorManager';
import { hexOpacity } from '@ui/theme/utils';

export function Sidebar() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<Component | undefined>(undefined);
  const disclosure = useBlockListDisclosure((state) => state);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const theme = useTheme();
  const { t } = useTranslation();

  const showTabs = !!selectedComponent && selectedComponent?.get('type') !== 'wrapper';

  const handleComponentChange = () => {
    setSelectedComponent(editor.getSelected());
  };

  // const handleCloseBlockDrawerOnDrop = () => {
  //   setTimeout(disclosure.onClose, 200);
  // };

  useEffect(() => {
    editor.on('component:selected', handleComponentChange);
    editor.on('component:deselected', handleComponentChange);
    editor.on('component:remove', handleComponentChange);
    // editor.on('block:drag:stop', handleCloseBlockDrawerOnDrop);

    return () => {
      editor.off('component:selected', handleComponentChange);
      editor.off('component:deselected', handleComponentChange);
      editor.off('component:remove', handleComponentChange);
      // editor.off('block:drag:stop', handleCloseBlockDrawerOnDrop);
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
          // lazyBehavior="unmount"
          // isLazy
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
              fontSize="14px"
              borderRadius={0}
              borderWidth={0}
              borderBottom="2px"
              borderColor="transparent"
              _selected={{
                bg: hexOpacity(theme.colors.dodger[600], 0.1),
                borderColor: theme.colors.dodger[600],
                color: theme.colors.dodger[600],
              }}
            >
              {t('Styles')}
            </Tab>
            <Tab
              as={Button}
              variant="ghost"
              py="12px"
              flex={1}
              fontSize="14px"
              borderRadius={0}
              borderWidth={0}
              borderBottom="2px"
              borderColor="transparent"
              _selected={{
                bg: hexOpacity(theme.colors.dodger[600], 0.1),
                borderColor: theme.colors.dodger[600],
                color: theme.colors.dodger[600],
              }}
            >
              {t('Settings')}
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
              {t('Select component')}
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
              {t('or')}
            </AbsoluteCenter>
          </Box>
          <Button
            colorScheme="dodger"
            size="sm"
            onClick={disclosure.onOpen}
            leftIcon={<FaCirclePlus size={20} />}
            iconSpacing="6px"
          >
            {t('Add Components')}
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
          <BlockManager />
        </DrawerContent>
      </Drawer>
    </>
  );
}
