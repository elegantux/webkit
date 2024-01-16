import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  SlideFade,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';

import { TraitManager } from '@app/editor/components/manager/TraitManager';
import { BlockManager } from '@app/editor/components/manager/BlockManager';
import { StyleManager } from '@app/editor/components/manager/StyleManager';
import { useBlockListDisclosure } from '@app/editor/lib/store';

export function Sidebar() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const disclosure = useBlockListDisclosure((state) => state);
  return (
    <>
      <Tabs
        tabIndex={tabIndex}
        onChange={setTabIndex}
        borderRight="2px solid"
        borderRightColor="var(--chakra-colors-chakra-border-color)"
        minH="100%"
      >
        <TabList>
          <Tab>Styles</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SlideFade
              in={tabIndex === 0}
              offsetX="20px"
            >
              <StyleManager />
            </SlideFade>
          </TabPanel>
          <TabPanel p={0}>
            <SlideFade
              in={tabIndex === 1}
              offsetX="20px"
            >
              <TraitManager />
            </SlideFade>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
