import {
  Box,
  Button,
  Code,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue,
  useDisclosure,
  useEditableControls,
  useTheme,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaSquare, FaSquareCheck, FaXmark } from 'react-icons/fa6';
import { Selector, State } from 'grapesjs';
import { create } from 'zustand';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { checkSync, getBlockMedia, syncStyle } from '@app/editor/lib/utils';
import { hexOpacity } from '@ui/theme/utils';

interface SelectorManagerStoreInterface {
  selectors: Selector[];
  states: State[];
  state: State | undefined;
  targets: string;
  setState: (payload: Omit<SelectorManagerStoreInterface, 'setState'>) => void;
}
export const useSelectorManagerStore = create<SelectorManagerStoreInterface>((set) => ({
  selectors: [],
  states: [],
  state: undefined,
  targets: '',
  setState: (payload: Omit<SelectorManagerStoreInterface, 'setState'>) => {
    set(() => ({ ...payload }));
  },
}));

function EditableControls() {
  const { isEditing, getEditButtonProps } = useEditableControls();

  if (isEditing) {
    return null;
  }

  return (
    <Tag
      size="sm"
      borderRadius="6px"
      variant="solid"
      colorScheme="grey"
      cursor="pointer"
      userSelect="none"
      {...getEditButtonProps()}
    >
      <TagLeftIcon as={FaPlus} />
      <TagLabel>Add</TagLabel>
    </Tag>
  );
}

function AddSelectorButton({ onSubmit }: { onSubmit: (selector: string) => void }) {
  const [value, setValue] = useState('');

  const disclosure = useDisclosure();

  const handleSubmit = (v: string) => {
    onSubmit(v);
    setValue('');
    disclosure.onClose();
  };

  const handleCancel = () => {
    disclosure.onClose();
  };

  return (
    <Editable
      display="flex"
      fontSize="sm"
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPreviewFocusable={false}
    >
      <EditableControls />
      <EditablePreview />
      <Input
        size="xs"
        borderRadius="6px"
        height="20px"
        as={EditableInput}
      />
    </Editable>
  );
}

export function SelectorManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const isComponentFirst = editor.SelectorManager.getComponentFirst();
  const selectedComponent = editor.getSelected();
  const componentBlock = useMemo(
    () => editor.BlockManager.get(selectedComponent?.get('type') ?? ''),
    [selectedComponent]
  );
  const componentIcon = componentBlock ? getBlockMedia(componentBlock) : null;
  const showSyncStylesButton = useMemo(() => isComponentFirst && checkSync(editor), [editor, isComponentFirst]);

  const selectorManagerState = useSelectorManagerStore((state) => state);
  const setSelectorManagerState = useSelectorManagerStore((state) => state.setState);
  const isStateSelected = selectorManagerState.state && selectorManagerState.state.getName().length > 0;

  const theme = useTheme();
  const activeStateBgColor = useColorModeValue(
    hexOpacity(theme.colors.green[100], 0.3),
    hexOpacity(theme.colors.green[900], 0.5)
  );
  const activeBgColor = useColorModeValue('grey.50', 'grey.700');
  const selectorListBgColor = useColorModeValue(theme.colors.grey['200'], theme.colors.ebony['400']);

  const onStateChange = (item?: State) => {
    if (item) {
      editor.SelectorManager.setState(item.getName());
    } else {
      editor.SelectorManager.setState('');
    }
  };

  const onRemoveSelector = (selector: Selector) => {
    editor.SelectorManager.removeSelected(selector);
  };

  const handleAddSelector = (selector: string) => {
    if (selector.trim().length > 0) {
      editor.SelectorManager.addSelected({ name: selector, label: selector });
    }
  };

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

  useEffect(() => {
    editor.on('selector:custom', handleSelectorChange);

    handleSelectorChange();

    return () => {
      editor.off('selector:custom', handleSelectorChange);
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
        <Flex
          align="center"
          gap="8px"
          color="dodger.600"
        >
          <Box
            width="24px"
            height="24px"
            sx={{
              '& svg, & img': {
                height: '100%',
              },
            }}
          >
            {componentIcon ?? (
              <svg
                width="100%"
                height="42px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 18L21 12L16 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6L3 12L8 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="8.53015"
                  y1="20.829"
                  x2="14.6865"
                  y2="3.91452"
                  stroke="currentColor"
                />
              </svg>
            )}
          </Box>
          <Text
            fontSize="sm"
            fontWeight="500"
          >
            {selectedComponent?.getName()}
          </Text>
        </Flex>
        <Flex
          alignItems="center"
          gap="4px"
        >
          <Text fontSize="sm">State:</Text>
          <Menu>
            <MenuButton
              as={Button}
              size="sm"
              variant="link"
              colorScheme="ebony"
              fontWeight="500"
              {...(isStateSelected ? { color: 'dodger.500' } : {})}
            >
              {selectorManagerState.state?.getName() ? selectorManagerState.state?.getName() : 'default'}
            </MenuButton>
            <MenuList zIndex={2}>
              <MenuItem
                onClick={() => onStateChange()}
                {...(selectorManagerState.state?.getName() === ''
                  ? {
                      bgColor: activeBgColor,
                    }
                  : {})}
              >
                default
              </MenuItem>
              {selectorManagerState.states.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => onStateChange(item)}
                  {...(selectorManagerState.state?.id === item.id
                    ? {
                        bgColor: activeBgColor,
                      }
                    : {})}
                >
                  {item.getLabel()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {isStateSelected && (
            <IconButton
              aria-label="clear state"
              size="xs"
              variant="ghost"
              p={0}
              minW="auto"
              h="auto"
              icon={<FaXmark size={14} />}
              onClick={() => onStateChange()}
            />
          )}
        </Flex>
      </Flex>
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
    </Box>
  );
}
