import React, { useEffect, useMemo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { Sector } from 'grapesjs';
import { FaPen } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore, useStyleManagerSectorsStore } from '@app/editor/lib/store';
import { STYLE_TYPES } from '@app/editor/components/style-manager/lib/constant';
import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { ResizeCursor } from '@app/editor/components/style-manager/components/ResizeCursor';
import { InputPropertyType } from '@app/editor/components/style-manager/components/InputPropertyType';
import { SelectPropertyType } from '@app/editor/components/style-manager/components/SelectPropertyType';
import { RadioPropertyType } from '@app/editor/components/style-manager/components/RadioPropertyType';
import { ColorPropertyType } from '@app/editor/components/style-manager/components/ColorPropertyType';
import { NumberPropertyType } from '@app/editor/components/style-manager/components/NumberPropertyType';
import { FontFamilyProperty } from '@app/editor/components/style-manager/components/FontFamilyProperty';
import { DisplaySector } from '@app/editor/components/style-manager/components/sectors/DisplaySector';

function StyleSector({ sector }: { sector: Sector }) {
  const sectorName = sector.getName();
  const propertyList = sector.getProperties() as ExtendedProperty[];

  const changedCategoryColor = useColorModeValue('dodger.500', 'dodger.300');
  const hasChanges = useMemo(() => propertyList.map((property) => property.hasValue()).includes(true), [propertyList]);

  return (
    <AccordionItem
      key={sector.getId()}
      sx={{ '& [aria-expanded="true"] + .chakra-collapse': { overflow: 'visible !important' } }}
    >
      <AccordionButton
        as={Flex}
        position="sticky"
        top="40px"
        justifyContent="space-between"
        cursor="pointer"
        userSelect="none"
        bgColor="var(--chakra-colors-chakra-body-bg)"
        zIndex={1}
        _hover={{
          bgColor: 'var(--chakra-colors-chakra-body-bg)',
        }}
      >
        <Heading
          as="span"
          display="flex"
          alignItems="center"
          gap="6px"
          fontSize="sm"
          {...(hasChanges ? { color: changedCategoryColor } : {})}
        >
          {hasChanges && <FaPen size={10} />}
          {sectorName}
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={3}
        >
          {propertyList.map((property) => {
            const propertyType = property.getType();
            const propertyName = property.getName();

            if (property.attributes.visible && propertyName === 'font-family') {
              return (
                <GridItem
                  key={property.id}
                  colSpan={property.attributes.colSpan}
                >
                  <FontFamilyProperty property={property} />
                </GridItem>
              );
            }

            return (
              <React.Fragment key={property.id}>
                {property.attributes.visible && (
                  <GridItem
                    key={property.id}
                    colSpan={property.attributes.colSpan}
                  >
                    {propertyType === STYLE_TYPES.INPUT && <InputPropertyType property={property} />}
                    {propertyType === STYLE_TYPES.NUMBER && <NumberPropertyType property={property} />}
                    {propertyType === STYLE_TYPES.SELECT && <SelectPropertyType property={property} />}
                    {propertyType === STYLE_TYPES.RADIO && <RadioPropertyType property={property} />}
                    {propertyType === STYLE_TYPES.COLOR && <ColorPropertyType property={property} />}
                  </GridItem>
                )}
              </React.Fragment>
            );
          })}
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
}

export function StyleManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const sectorList = useStyleManagerSectorsStore(EDITOR_STORE.SECTOR_LIST);
  const setSectorList = useStyleManagerSectorsStore(EDITOR_STORE.SET_SECTOR_LIST);
  const styleManager = editor.StyleManager;
  // const sectors = styleManager.getSectors({ visible: true });

  const onStyleChange = () => {
    // console.log(
    //   'onStyleChange',
    //   styleManager
    //     .getSectors({ visible: true })
    //     .map((s) =>
    //       s
    //         .getProperties()
    //         .map((p) => `${p.getName()} - ${p.getValue()}`)
    //         .join(' | ')
    //     )
    //     .join(' ')
    // );
    setSectorList(styleManager.getSectors({ visible: true }));
  };

  useEffect(() => {
    editor.on('style:custom', onStyleChange);
    editor.on('undo', onStyleChange);
    editor.on('redo', onStyleChange);

    onStyleChange();

    return () => {
      editor.off('style:custom', onStyleChange);
      editor.off('undo', onStyleChange);
      editor.off('redo', onStyleChange);
    };
  }, [editor]);

  return (
    <>
      <ResizeCursor />
      <Accordion
        defaultIndex={[0, 1, 2, 3, 4]}
        allowMultiple
      >
        {sectorList.map((sector) => (
          <React.Fragment key={sector.getId()}>
            {sector.getId() === 'display' ? (
              <DisplaySector
                key={sector.getId()}
                sector={sector}
              />
            ) : (
              <StyleSector
                key={sector.getId()}
                sector={sector}
              />
            )}
          </React.Fragment>
        ))}
      </Accordion>
    </>
  );
}
