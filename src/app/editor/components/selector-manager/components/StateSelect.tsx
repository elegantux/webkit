import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { State } from 'grapesjs';
import { FaXmark } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

import { useSelectorManagerStore } from '@app/editor/components/selector-manager/lib/utils';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';

export function StateSelect() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const selectorManagerState = useSelectorManagerStore((state) => state);
  const isStateSelected = selectorManagerState.state && selectorManagerState.state.getName().length > 0;

  const activeBgColor = useColorModeValue('grey.50', 'grey.700');
  const { t } = useTranslation();

  const onStateChange = (item?: State) => {
    if (item) {
      editor.SelectorManager.setState(item.getName());
    } else {
      editor.SelectorManager.setState('');
    }
  };

  return (
    <Flex
      alignItems="center"
      gap="4px"
    >
      <Text fontSize="sm">{t('State')}:</Text>
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
  );
}
