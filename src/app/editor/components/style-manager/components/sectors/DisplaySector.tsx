import { Sector } from 'grapesjs';
import {
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
import React, { useEffect, useMemo, useState } from 'react';
import { FaPen } from 'react-icons/fa6';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { STYLE_TYPES } from '@app/editor/components/style-manager/lib/constant';
import { InputPropertyType } from '@app/editor/components/style-manager/components/InputPropertyType';
import { NumberPropertyType } from '@app/editor/components/style-manager/components/NumberPropertyType';
import { SelectPropertyType } from '@app/editor/components/style-manager/components/SelectPropertyType';
import { RadioPropertyType } from '@app/editor/components/style-manager/components/RadioPropertyType';
import { ColorPropertyType } from '@app/editor/components/style-manager/components/ColorPropertyType';
import { GridTemplateColumnsType } from '@app/editor/components/style-manager/components/GridTemplateColumnsType';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

const GRID_PROPERTIES_MAP = {
  GRID_TEMPLATE_COLUMNS: 'grid-template-columns',
  GRID_TEMPLATE_ROWS: 'grid-template-rows',
  // JUSTIFY_CONTENT: 'justify-content',
  ALIGN_CONTENT: 'align-content',
};

const FLEX_PROPERTIES_MAP = {
  JUSTIFY_CONTENT: 'justify-content',
  ALIGN_ITEMS: 'align-items',
  FLEX_DIRECTION: 'flex-direction',
  FLEX_WRAP: 'flex-wrap',
  FLEX: 'flex',
};

const COMMON_PROPERTIES_MAP = {
  GAP: 'gap',
};

const checkIfShouldBeHidden = (property: ExtendedProperty, displayType: string | undefined) => {
  if (displayType === 'grid') {
    return Object.values(FLEX_PROPERTIES_MAP).includes(property.id as string);
  }
  if (displayType && ['flex', 'inline-flex'].includes(displayType)) {
    return Object.values(GRID_PROPERTIES_MAP).includes(property.id as string);
  }
  return [
    ...Object.values(GRID_PROPERTIES_MAP),
    ...Object.values(FLEX_PROPERTIES_MAP),
    COMMON_PROPERTIES_MAP.GAP,
  ].includes(property.id as string);
};

/**
 * Clear all styles associated with "flex" or "grid" when selecting something else(e.g. block, none, ...).
 * ⚠️ Not finished yet. Need to not forget to clear the values from all states and media queries.
 */
// const clearPropertiesValuesByDisplayType = (propertyList: ExtendedProperty[], displayType: string | undefined) => {
//   let propsToClear = [];
//
//   if (displayType === 'grid') {
//     propsToClear = propertyList.filter((property) =>
//       Object.values(GRID_PROPERTIES_MAP).includes(property.id as string)
//     );
//   } else {
//     propsToClear = propertyList.filter((property) =>
//       Object.values(FLEX_PROPERTIES_MAP).includes(property.id as string)
//     );
//   }
//
//   propsToClear.map((property) => property.clear());
// };

/**
 * This component allows you to switch between Flex and Grid style properties.
 * Methods I tried:
 * 1. 😩 Simply filter the sector.getProperties(). This doesn't work after switching between Flex and Grid.
 * 2. 😩 Methods styleManager.removeProperty/addProperty(). This doesn't work the same way as the first option.
 * 3. 👍 Hide/Show properties using css(display: none/block). It works. This means the issue is likely related to object linking. Not sure.
 * @param sector
 * @constructor
 */
export function DisplaySector({ sector }: { sector: Sector }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const displayProperty = sector.getProperty('display');
  const [displayPropertyValue, setDisplayPropertyValue] = useState<string | undefined>(displayProperty?.getValue());

  const sectorName = sector.getName();
  const propertyList = sector.getProperties() as ExtendedProperty[];

  const changedCategoryColor = useColorModeValue('dodger.500', 'dodger.300');
  const hasChanges = useMemo(() => propertyList.map((property) => property.hasValue()).includes(true), [propertyList]);

  const onStyleChange = () => {
    setDisplayPropertyValue(displayProperty?.getValue());
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
    <AccordionItem key={sector.getId()}>
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

            if (property.id === GRID_PROPERTIES_MAP.GRID_TEMPLATE_COLUMNS) {
              return (
                <React.Fragment key={property.id}>
                  <GridItem
                    key={property.id}
                    colSpan={property.attributes.colSpan}
                    {...(checkIfShouldBeHidden(property, displayPropertyValue) ? { display: 'none' } : {})}
                  >
                    <GridTemplateColumnsType property={property} />
                  </GridItem>
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={property.id}>
                {property.attributes.visible && (
                  <GridItem
                    key={property.id}
                    colSpan={property.attributes.colSpan}
                    {...(checkIfShouldBeHidden(property, displayPropertyValue) ? { display: 'none' } : {})}
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
