import {
  Box,
  Button,
  Code,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { FaBroom, FaMobileButton, FaTabletButton, FaTv, FaXmark } from 'react-icons/fa6';
import { Device, State } from 'grapesjs';
import { create } from 'zustand';
import { useEffect } from 'react';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { useSelectorManagerStore } from '@app/editor/components/selector-manager/lib/utils';
import { hexOpacity } from '@ui/theme/utils';
import { DEVICE_TYPE, DEVICE_TYPE_NAME } from '@app/editor/lib/constant';

type UpdateChildSelectorsStore = Omit<
  ChildSelectorsStoreInterface,
  'setChildSelectorsState' | 'resetChildSelectorsState'
>;

interface ChildSelectorsStoreInterface {
  styleManagerSelector?: string;
  parentSelector?: string;
  selectedChildSelector?: string;
  selectedChildSelectorState?: string;
  selectedChildSelectorMedia?: string;
  setChildSelectorsState: (payload: UpdateChildSelectorsStore) => void;
  resetChildSelectorsState: () => void;
}

export const useChildSelectorsStore = create<ChildSelectorsStoreInterface>((set) => ({
  styleManagerSelector: undefined,
  parentSelector: undefined,
  selectedChildSelector: undefined,
  selectedChildSelectorState: undefined,
  selectedChildSelectorMedia: DEVICE_TYPE.DESKTOP,
  setChildSelectorsState: (payload: UpdateChildSelectorsStore) => {
    set((prevState) => ({ ...prevState, ...payload }));
  },
  resetChildSelectorsState: () => {
    set(() => ({
      selectedChildSelector: undefined,
      selectedChildSelectorState: undefined,
      selectedChildSelectorMedia: DEVICE_TYPE.DESKTOP,
    }));
  },
}));

const DEVICE_TYPE_ICON = {
  [DEVICE_TYPE.DESKTOP]: <FaTv size={16} />,
  [DEVICE_TYPE.TABLET]: <FaTabletButton size={16} />,
  [DEVICE_TYPE.MOBILE_LANDSCAPE]: <FaMobileButton size={16} />,
  [DEVICE_TYPE.MOBILE_PORTRAIT]: <FaMobileButton size={16} />,
};

const updateChildStyleSelector = () => {
  const { editor } = useEditorStore.getState();
  const childSelectorState = useChildSelectorsStore.getState();

  let styleManagerSelector: string | undefined;
  if (childSelectorState.selectedChildSelector) {
    const parentSelectorClasses = editor.SelectorManager.getSelected()
      .map((s) => s.toString())
      .join('');

    const parentState = editor.SelectorManager.getState().length > 0 ? `:${editor.SelectorManager.getState()}` : '';
    const selectorState = childSelectorState.selectedChildSelectorState
      ? `:${childSelectorState.selectedChildSelectorState}`
      : '';

    styleManagerSelector = `${parentSelectorClasses}${parentState} ${childSelectorState.selectedChildSelector}${selectorState}`;

    if (
      childSelectorState.selectedChildSelectorMedia &&
      childSelectorState.selectedChildSelectorMedia !== DEVICE_TYPE.DESKTOP
    ) {
      const device: Device = editor.DeviceManager.get(childSelectorState.selectedChildSelectorMedia)!;

      const cssRuleOptions = {
        addStyles: true,
        atRuleType: 'media',
        atRuleParams: `(max-width: ${device.getWidthMedia()})`,
      };

      let rule = editor.Css.getRule(styleManagerSelector, cssRuleOptions);

      if (!rule) {
        rule = editor.Css.setRule(styleManagerSelector, {}, cssRuleOptions);
      }

      // console.log('updateChildStyleSelector', rule);

      editor.StyleManager.select(rule);
    } else {
      editor.StyleManager.select(styleManagerSelector);
    }
  } else {
    // @ts-ignore
    editor.StyleManager.select(editor.getSelected());
  }
  childSelectorState.setChildSelectorsState({ styleManagerSelector });
};

const clearChildSelectorStyles = () => {
  const { editor } = useEditorStore.getState();
  const childSelectorState = useChildSelectorsStore.getState();

  let styleManagerSelector: string | undefined;
  if (childSelectorState.selectedChildSelector) {
    const parentSelectorClasses = editor.SelectorManager.getSelected()
      .map((s) => s.toString())
      .join('');

    const parentState = editor.SelectorManager.getState().length > 0 ? `:${editor.SelectorManager.getState()}` : '';
    const selectorState = childSelectorState.selectedChildSelectorState
      ? `:${childSelectorState.selectedChildSelectorState}`
      : '';

    styleManagerSelector = `${parentSelectorClasses}${parentState} ${childSelectorState.selectedChildSelector}${selectorState}`;

    if (
      childSelectorState.selectedChildSelectorMedia &&
      childSelectorState.selectedChildSelectorMedia !== DEVICE_TYPE.DESKTOP
    ) {
      const device: Device = editor.DeviceManager.get(childSelectorState.selectedChildSelectorMedia)!;

      const cssRuleOptions = {
        addStyles: true,
        atRuleType: 'media',
        atRuleParams: `(max-width: ${device.getWidthMedia()})`,
      };

      const rule = editor.Css.getRule(styleManagerSelector, cssRuleOptions);

      if (rule) {
        rule.setStyle({});
      }
      // console.log('clearChildSelectorStyles', rule);

      // editor.StyleManager.select(rule);
    } else {
      // editor.StyleManager.select(styleManagerSelector);
      editor.Css.getRule(styleManagerSelector)?.setStyle({});
    }
  }
};

function StateSelect() {
  const selectedChildSelectorState = useChildSelectorsStore((store) => store.selectedChildSelectorState);
  const setChildSelectorsState = useChildSelectorsStore((store) => store.setChildSelectorsState);

  const selectorManagerState = useSelectorManagerStore((state) => state);
  const isStateSelected = !!selectedChildSelectorState;

  const activeBgColor = useColorModeValue('grey.50', 'grey.700');

  const onStateChange = (item?: State) => {
    if (item) {
      // editor.SelectorManager.setState(item.getName());
      setChildSelectorsState({ selectedChildSelectorState: item.id as string });
    } else {
      // editor.SelectorManager.setState('');
      setChildSelectorsState({ selectedChildSelectorState: undefined });
    }

    updateChildStyleSelector();
  };

  return (
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
          mr={0}
          {...(isStateSelected ? { color: 'dodger.500' } : {})}
        >
          {selectedChildSelectorState ?? 'default'}
        </MenuButton>
        <MenuList zIndex={2}>
          <MenuItem
            onClick={() => onStateChange()}
            {...(!selectedChildSelectorState
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
              {...(selectedChildSelectorState === item.id
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
  );
}

function ChildSelectorList({ childSelectorList }: { childSelectorList: string[] }) {
  const selectedChildSelector = useChildSelectorsStore((store) => store.selectedChildSelector);
  const setChildSelectorsState = useChildSelectorsStore((store) => store.setChildSelectorsState);

  const theme = useTheme();
  const selectorListBgColor = useColorModeValue(theme.colors.grey['200'], theme.colors.ebony['400']);

  const handleSelectorClick = (selector: string) => {
    const childSelector: string | undefined = selector === selectedChildSelector ? undefined : selector;
    setChildSelectorsState({ selectedChildSelector: childSelector });
    updateChildStyleSelector();
  };

  return (
    <Flex
      flexWrap="wrap"
      gap="4px"
      mt="8px"
      p="4px"
      borderRadius="6px"
      bg={hexOpacity(selectorListBgColor, 0.5)}
    >
      {childSelectorList.map((item) => (
        <Tag
          key={item}
          size="sm"
          variant="solid"
          colorScheme={selectedChildSelector === item ? 'green' : 'grey'}
          pl="6px"
          cursor="pointer"
          onClick={() => handleSelectorClick(item)}
        >
          <TagLabel>{item}</TagLabel>
        </Tag>
      ))}
    </Flex>
  );
}

function SelectedChildSelector() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const styleManagerSelector = useChildSelectorsStore((store) => store.styleManagerSelector);
  const selectedChildSelectorMedia = useChildSelectorsStore((store) => store.selectedChildSelectorMedia);
  const selectedChildSelectorState = useChildSelectorsStore((store) => store.selectedChildSelectorState);
  const setChildSelectorsState = useChildSelectorsStore((store) => store.setChildSelectorsState);

  const theme = useTheme();
  const selectorListBgColor = useColorModeValue(theme.colors.grey['200'], theme.colors.ebony['400']);
  const selectorListActiveBgColor = useColorModeValue(theme.colors.malachite['200'], theme.colors.malachite['900']);

  const handleDeviceButtonClick = (device: string) => {
    editor.setDevice(device);
    setChildSelectorsState({ selectedChildSelectorMedia: device });
  };

  const handleClearSelectorStyles = () => {
    if (styleManagerSelector) {
      clearChildSelectorStyles();
    }
  };

  return (
    <Box
      bg={selectedChildSelectorState ? selectorListActiveBgColor : hexOpacity(selectorListBgColor, 0.5)}
      px="4px"
      py="4px"
      borderRadius="6px"
    >
      <Flex
        justify="space-between"
        alignItems="center"
        mb="6px"
      >
        <Flex gap="12px">
          <Flex gap="2px">
            {Object.values(DEVICE_TYPE).map((device) => (
              <Tooltip
                key={device}
                placement="bottom"
                borderRadius="4px"
                label={DEVICE_TYPE_NAME[device]}
                hasArrow
              >
                <IconButton
                  variant="ghost"
                  size="xs"
                  mr={0}
                  colorScheme={selectedChildSelectorMedia === device ? 'dodger' : 'grey'}
                  aria-label={DEVICE_TYPE_NAME[device]}
                  icon={DEVICE_TYPE_ICON[device]}
                  {...(device === DEVICE_TYPE.MOBILE_LANDSCAPE ? { transform: 'rotate(90deg)' } : {})}
                  onClick={() => handleDeviceButtonClick(device)}
                />
              </Tooltip>
            ))}
          </Flex>
        </Flex>
        <StateSelect />
      </Flex>
      <Flex justify="space-between">
        <Flex
          flexWrap="wrap"
          alignItems="center"
          gap="6px"
        >
          <Text fontSize="sm">Selector:</Text>
          <Code
            fontSize="xs"
            wordBreak="break-all"
            borderRadius="6px"
            colorScheme="green"
          >
            {styleManagerSelector}
          </Code>
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
            icon={<FaBroom size={18} />}
            onClick={handleClearSelectorStyles}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
}

export function ChildSelectors({ isOpen, childSelectorList }: { isOpen: boolean; childSelectorList: string[] }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const selectedChildSelector = useChildSelectorsStore((store) => store.selectedChildSelector);
  const resetChildSelectorsState = useChildSelectorsStore((store) => store.resetChildSelectorsState);

  const resetChildSelector = () => {
    resetChildSelectorsState();
    updateChildStyleSelector();
    editor.setDevice(DEVICE_TYPE.DESKTOP);
  };

  useEffect(() => {
    resetChildSelector();

    return () => {
      resetChildSelector();
    };
  }, [isOpen]);

  useEffect(() => {
    editor.on('selector:custom', updateChildStyleSelector);

    return () => {
      editor.off('selector:custom', updateChildStyleSelector);
    };
  }, []);

  return (
    <>
      {selectedChildSelector && <SelectedChildSelector />}
      <ChildSelectorList childSelectorList={childSelectorList} />
    </>
  );
}
