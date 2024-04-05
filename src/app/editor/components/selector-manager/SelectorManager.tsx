import { Box, Button, Collapse, Flex, Text, useColorModeValue, useDisclosure, useTheme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { hexOpacity } from '@ui/theme/utils';
import { SelectedComponentLabel } from '@app/editor/components/selector-manager/components/SelectedComponentLabel';
import { StateSelect } from '@app/editor/components/selector-manager/components/StateSelect';
import { SelectorTargets } from '@app/editor/components/selector-manager/components/SelectorTargets';
import { ChildSelectors } from '@app/editor/components/selector-manager/components/ChildSelectors';
import { useSelectorManagerStore } from '@app/editor/components/selector-manager/lib/utils';
import { TRAIT_TYPES } from '@app/editor/lib/constant';

export function SelectorManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [childSelectorList, setChildSelectorList] = useState<string[]>([]);

  const selectorManagerState = useSelectorManagerStore((state) => state);
  const setSelectorManagerState = useSelectorManagerStore((state) => state.setState);
  const isStateSelected = selectorManagerState.state && selectorManagerState.state.getName().length > 0;

  const selectorsDisclosure = useDisclosure();
  const theme = useTheme();
  const activeStateBgColor = useColorModeValue(
    hexOpacity(theme.colors.green[100], 1),
    hexOpacity(theme.colors.green[900], 1)
  );

  const handleSelectorChange = () => {
    const lSelectors = editor.SelectorManager.getSelected();
    const lStates = editor.SelectorManager.getStates();
    const lState = lStates.find((item) => item.getName() === editor.SelectorManager.getState());
    const lTargets = editor.SelectorManager.getSelectedTargets()
      .map((targetItem) => targetItem.getSelectorsString())
      .join(', ');

    setSelectorManagerState({
      selectors: lSelectors,
      states: lStates,
      state: lState,
      targets: lTargets,
    });
  };

  /**
   * This callback is meant to update the list of child selectors,
   * which are taken from the component settings(traits - TRAIT_TYPES.CHILD_SELECTOR).
   */
  const handleUpdateTraitList = () => {
    const selectorList = editor.Traits.getTraits()
      .filter((trait) => trait.getType() === TRAIT_TYPES.CHILD_SELECTOR)
      .map((trait) => trait.getValue());

    setChildSelectorList(selectorList.length > 0 ? selectorList : []);
    selectorsDisclosure.onClose();
  };

  useEffect(() => {
    editor.on('selector:custom', handleSelectorChange);

    handleSelectorChange();

    return () => {
      editor.off('selector:custom', handleSelectorChange);
    };
  }, []);

  useEffect(() => {
    editor.on('trait:custom', handleUpdateTraitList);

    return () => {
      editor.off('trait:custom', handleUpdateTraitList);
    };
  }, []);

  return (
    <Box
      bgColor={isStateSelected ? activeStateBgColor : 'var(--chakra-colors-chakra-body-bg)'}
      width="100%"
      py="8px"
      px="16px"
    >
      <Flex
        justify="space-between"
        alignItems="center"
      >
        <SelectedComponentLabel />
        <StateSelect />
      </Flex>
      <Collapse
        in={!selectorsDisclosure.isOpen}
        animateOpacity
      >
        <SelectorTargets />
      </Collapse>
      {childSelectorList.length > 0 && (
        <>
          <Flex justify="center">
            <Button
              variant="ghost"
              colorScheme="grey"
              size="xs"
              height="auto"
              mt="8px"
              mb="4px"
              onClick={selectorsDisclosure.onToggle}
            >
              <Flex
                direction="column"
                alignItems="center"
              >
                {!selectorsDisclosure.isOpen && (
                  <Box transform="rotate(180deg)">
                    <FaChevronDown
                      size={12}
                      color={theme.colors.malachite[600]}
                    />
                  </Box>
                )}
                <Text as="span">{selectorsDisclosure.isOpen ? 'Parent Selectors' : 'Child Selectors'}</Text>
                {selectorsDisclosure.isOpen && (
                  <Box>
                    <FaChevronDown
                      size={12}
                      color={theme.colors.malachite[600]}
                    />
                  </Box>
                )}
              </Flex>
            </Button>
          </Flex>
          <Collapse
            in={selectorsDisclosure.isOpen}
            animateOpacity
          >
            <ChildSelectors
              isOpen={selectorsDisclosure.isOpen}
              childSelectorList={childSelectorList}
            />
          </Collapse>
        </>
      )}
    </Box>
  );
}
