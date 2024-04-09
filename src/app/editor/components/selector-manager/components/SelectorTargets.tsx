import { useMemo } from 'react';
import {
  Code,
  Flex,
  IconButton,
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { Selector } from 'grapesjs';
import { FaRegTrashCan, FaSquare, FaSquareCheck } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { checkSync, syncStyle } from '@app/editor/lib/utils';
import { useSelectorManagerStore } from '@app/editor/components/selector-manager/lib/utils';
import { hexOpacity } from '@ui/theme/utils';
import { AddSelectorButton } from '@app/editor/components/selector-manager/components/AddSelectorButton';

export function SelectorTargets() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const isComponentFirst = editor.SelectorManager.getComponentFirst();
  const showSyncStylesButton = useMemo(() => isComponentFirst && checkSync(editor), [editor, isComponentFirst]);

  const selectorManagerState = useSelectorManagerStore((state) => state);

  const theme = useTheme();
  const selectorListBgColor = useColorModeValue(theme.colors.grey['200'], theme.colors.ebony['400']);

  const onRemoveSelector = (selector: Selector) => {
    editor.SelectorManager.removeSelected(selector);
  };

  const handleAddSelector = (selector: string) => {
    if (selector.trim().length > 0) {
      editor.SelectorManager.addSelected({ name: selector, label: selector });
    }
  };

  const handleClearSelectorStyles = () => {
    const selected = editor.SelectorManager.getSelected();
    const joinedSelectors = selected.map((s) => s.toString()).join('');
    const rule = editor.Css.getRule(joinedSelectors);

    if (rule) {
      rule.setStyle({});
    }

    // const rules = editor.Css.getRules(joinedSelectors);
    // const allRules = editor.Css.getRules();

    // console.log(joinedSelectors, rule, allRules);
    // rules.forEach((rule) => {
    //   console.log('rule', rule.toCSS());
    //   rule.setStyle({});
    // });
    // selected.forEach((selector) => {
    // });
  };

  return (
    <>
      <Flex justify="space-between">
        <Flex
          align="center"
          gap="4px"
          wrap="wrap"
          py="2px"
          my="4px"
        >
          <Text
            fontSize="xs"
            opacity="0.6"
          >
            Selector:
          </Text>
          <Code
            fontSize="xs"
            wordBreak="break-all"
            borderRadius="6px"
            colorScheme="green"
          >
            {selectorManagerState.targets}
          </Code>
          {showSyncStylesButton && (
            <Tag
              cursor="pointer"
              onClick={() => syncStyle(editor)}
            >
              Sync
            </Tag>
          )}
        </Flex>
        <Tooltip
          placement="bottom"
          borderRadius="4px"
          label="Clear all selector styles"
          hasArrow
        >
          <IconButton
            aria-label="Clear styles"
            variant="ghost"
            size="xs"
            colorScheme="grey"
            icon={<FaRegTrashCan size={16} />}
            onClick={handleClearSelectorStyles}
          />
        </Tooltip>
      </Flex>
      <Flex
        direction="column"
        p="4px"
        borderRadius="6px"
        bg={hexOpacity(selectorListBgColor, 0.5)}
      >
        <Flex
          gap="4px"
          flexWrap="wrap"
        >
          {selectorManagerState.selectors.map((selector) => (
            <Tag
              key={selector.toString()}
              size="sm"
              variant="solid"
              colorScheme="green"
              pl="6px"
              pr="2px"
              opacity={selector.getActive() ? 1 : 0.5}
            >
              <TagLeftIcon
                as={selector.getActive() ? FaSquareCheck : FaSquare}
                cursor="pointer"
                opacity="0.8"
                _hover={{ opacity: '1' }}
                onClick={() => selector.setActive(!selector.getActive())}
              />
              <TagLabel>{selector.getLabel()}</TagLabel>
              <TagCloseButton
                fontSize="md"
                onClick={() => onRemoveSelector(selector)}
              />
            </Tag>
          ))}
          <AddSelectorButton onSubmit={handleAddSelector} />
        </Flex>
      </Flex>
    </>
  );
}
