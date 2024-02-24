import { Block, Blocks } from 'grapesjs';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { ExtendedBlock } from '@lib/models/grapesjs-extended';
import { hexOpacity } from '@ui/theme/utils';

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

const getBlockMedia = (block: ExtendedBlock) => {
  if (block.attributes.image?.length) {
    return (
      <Image
        src={block.attributes.image}
        alt={block.getLabel()}
      />
    );
  }

  if (block.attributes.icon?.length) {
    return <Box dangerouslySetInnerHTML={{ __html: block.attributes.icon }} />;
  }

  return block.getLabel();
};

function BlockCard({ block }: { block: Block }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const blockMedia = getBlockMedia(block);

  const theme = useTheme();
  const color = useColorModeValue('ebony.500', 'grey.100');
  const bgColor = useColorModeValue(hexOpacity(theme.colors.grey[100], 0.6), hexOpacity(theme.colors.ebony[500], 0.8));
  const bgHoverColor = useColorModeValue('grey.200', 'ebony.400');

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
        bgColor={bgColor}
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
      <AccordionItem>
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
  console.log(
    'blockList',
    blockList.map((block) => block.getCategoryLabel()),
    sectionList
  );

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
