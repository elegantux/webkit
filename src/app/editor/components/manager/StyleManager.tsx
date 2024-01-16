import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Grid,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Sector, SectorProperties } from 'grapesjs';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

function StyleSection({ section }: { section: any }) {
  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
    >
      <AccordionItem>
        <AccordionButton
          as={Flex}
          justifyContent="space-between"
          cursor="pointer"
          userSelect="none"
        >
          <Heading
            as="span"
            fontSize="md"
          >
            {section.category}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Grid
            templateColumns="1fr 1fr"
            gap="12px"
          >
            {section.blockList.map((block) => (
              <>Style card here</>
            ))}
          </Grid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function StyleSector({ sector }: { sector: Sector }) {
  const sectorName = sector.getName().toLowerCase();

  return <Text>{sectorName}</Text>;
}

export function StyleManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const styleManager = editor.StyleManager;
  const sectors = styleManager.getSectors({ visible: true });
  console.log('sectors', sectors);
  return (
    <>
      <h1>Style section</h1>
      {sectors.map((sector) => (
        <StyleSector
          key={sector.getName()}
          sector={sector}
        />
      ))}
    </>
  );
}
