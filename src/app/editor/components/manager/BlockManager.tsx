import { Block, Blocks } from 'grapesjs';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { hexOpacity } from '@ui/theme/utils';
import { getBlockMedia } from '@app/editor/lib/utils';

interface Section {
  category: string;
  blockList: Block[];
}
const formatBlockListToSections = (blocks: Blocks) => {
  const availableCategories = new Set<string>();
  const result: Section[] = [];

  blocks.forEach((block) => {
    const category = block.getCategoryLabel();
    availableCategories.add(category);
  });

  availableCategories.forEach((category: string) => {
    const payload = {
      category,
      blockList: blocks.filter((block) => block.getCategoryLabel() === category),
    };

    result.push(payload);
  });

  return result;
};

function BlockCard({ block }: { block: Block }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const blockMedia = getBlockMedia(block);

  const theme = useTheme();
  const color = useColorModeValue('ebony.500', 'grey.100');
  const bgColor = useColorModeValue(theme.colors.grey[100], theme.colors.ebony[500]);
  const bgHoverColor = useColorModeValue(
    hexOpacity(theme.colors.grey[200], 0.2),
    hexOpacity(theme.colors.ebony[400], 0.2)
  );

  return (
    <GridItem
      onDragStart={() => editor.Blocks.startDrag(block)}
      onDragEnd={() => editor.Blocks.endDrag()}
      draggable
      userSelect="none"
      minW={0}
      cursor="move"
    >
      <Card
        height="100%"
        borderRadius="4px"
        boxShadow="none"
        color={color}
        // bgColor={bgColor}
        border="1px solid"
        borderColor={bgColor}
        bgColor="transparent"
        transition="background-color 0.1s ease-in-out"
        _hover={{ bgColor: bgHoverColor }}
      >
        <CardBody
          px="12px"
          py="12px"
        >
          <Flex
            width="100%"
            height="42px"
            justifyContent="center"
            alignItems="center"
          >
            {blockMedia}
          </Flex>
          <Text
            mt="8px"
            fontSize="13px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            textAlign="center"
            letterSpacing="0.5px"
          >
            {block.getLabel()}
          </Text>
        </CardBody>
      </Card>
    </GridItem>
  );
}

function BlockSection({ section }: { section: Section }) {
  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
    >
      <AccordionItem borderTopWidth={0}>
        <AccordionButton
          as={Flex}
          justifyContent="space-between"
          cursor="pointer"
          userSelect="none"
        >
          <Heading
            as="span"
            fontSize="sm"
            fontWeight="500"
            textTransform="uppercase"
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
              <BlockCard
                key={block.getId()}
                block={block}
              />
            ))}
          </Grid>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function BlockManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const blockList = editor.BlockManager.getAll();
  const sectionList = formatBlockListToSections(blockList);
  // console.log(
  //   'blockList',
  //   blockList.map((block) => block.getCategoryLabel()),
  //   sectionList
  // );

  return (
    <Flex direction="column">
      {sectionList.map((section) => (
        <BlockSection
          key={section.category}
          section={section}
        />
      ))}
    </Flex>
  );
}
