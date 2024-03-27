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
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaComputerMouse as ComputerMouseIcon, FaCirclePlus, FaMagnifyingGlass } from 'react-icons/fa6';
import { Component } from 'grapesjs';

import { TraitManager } from '@app/editor/components/trait-manager/TraitManager';
import { BlockManager } from '@app/editor/components/manager/BlockManager';
import { StyleManager } from '@app/editor/components/style-manager/StyleManager';
import {
  EDITOR_STORE,
  useBlockListDisclosure,
  useEditorStore,
  useRuleManagerDisclosure,
  useRuleManagerStore,
} from '@app/editor/lib/store';
import { SelectorManager } from '@app/editor/components/manager/SelectorManager';
import { CssRuleManager } from '@app/editor/components/style-manager/CssRuleManager';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { RuleManagerToggleSidebarCommandPayload } from '@lib/models/commands';
import { hexOpacity } from '@ui/theme/utils';

function RuleManagerDrawer() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const ruleManagerDisclosure = useRuleManagerDisclosure((state) => state);
  const setRuleManagerState = useRuleManagerStore((state) => state.setState);
  const setRuleManagerReset = useRuleManagerStore((state) => state.reset);
  const toast = useToast();

  const handleRuleManagerRunCommand = (_: any, options: RuleManagerToggleSidebarCommandPayload) => {
    if (!options.cssRule) {
      toast({
        title: `[Command: ${EDITOR_COMMANDS.TOGGLE_RULE_MANAGER_SIDEBAR}] The cssRule property is not defined.`,
        status: 'error',
      });
      return;
    }

    if (ruleManagerDisclosure.isOpen) {
      setRuleManagerState({ component: options.component, cssRule: options.cssRule });
      return;
    }

    setRuleManagerState({ component: options.component, cssRule: options.cssRule });
    ruleManagerDisclosure.onOpen();
  };

  const handleDrawerClose = () => {
    ruleManagerDisclosure.onClose();
    setRuleManagerReset();
  };

  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.TOGGLE_RULE_MANAGER_SIDEBAR}`, handleRuleManagerRunCommand);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.TOGGLE_RULE_MANAGER_SIDEBAR}`, handleRuleManagerRunCommand);
    };
  }, []);

  return (
    <Drawer
      variant="sidebar-with-transparent-overlay"
      placement="left"
      onClose={handleDrawerClose}
      isOpen={ruleManagerDisclosure.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          px="16px"
          borderBottomWidth="1px"
        >
          Rule Manager
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody p={0}>
          <CssRuleManager />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export function Sidebar() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<Component | undefined>(undefined);
  const disclosure = useBlockListDisclosure((state) => state);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const theme = useTheme();

  const showTabs = !!selectedComponent && selectedComponent?.get('type') !== 'wrapper';

  const handleComponentChange = () => {
    setSelectedComponent(editor.getSelected());
  };

  const handleCloseBlockDrawerOnDrop = () => {
    setTimeout(disclosure.onClose, 200);
  };

  useEffect(() => {
    editor.on('component:selected', handleComponentChange);
    editor.on('component:deselected', handleComponentChange);
    editor.on('component:remove', handleComponentChange);
    editor.on('block:drag:stop', handleCloseBlockDrawerOnDrop);

    return () => {
      editor.off('component:selected', handleComponentChange);
      editor.off('component:deselected', handleComponentChange);
      editor.off('component:remove', handleComponentChange);
      editor.off('block:drag:stop', handleCloseBlockDrawerOnDrop);
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
              Styles
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
            <InputGroup pr="40px">
              <InputLeftElement pointerEvents="none">
                <FaMagnifyingGlass />
              </InputLeftElement>
              <Input placeholder="search ..." />
            </InputGroup>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0}>
            <BlockManager />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <RuleManagerDrawer />
    </>
  );
}
