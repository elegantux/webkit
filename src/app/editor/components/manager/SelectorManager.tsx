import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';

const SELECTOR_MANAGER_STATES: Record<string, string> = {
  HOVER: 'hover',
  ACTIVE: 'active',
  NTH_2N: 'nth-of-type(2n)',
};

const STATES_SELECT_OPTIONS: SelectOptionProps[] = [
  { label: 'Default', value: '' },
  { label: 'Hover', value: SELECTOR_MANAGER_STATES.HOVER },
  { label: 'Active', value: SELECTOR_MANAGER_STATES.ACTIVE },
  { label: 'nth-of-type(2n)', value: SELECTOR_MANAGER_STATES.NTH_2N },
];

export function SelectorManager() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [selectValue, setSelectValue] = useState<SelectOptionProps>(STATES_SELECT_OPTIONS[0]);
  const activeBgColor = useColorModeValue('grey.50', 'grey.700');

  const onStateChange = (option: SelectOptionProps | any) => {
    setSelectValue(option);
    editor.SelectorManager.setState(option.value);
  };

  return (
    <Box
      bgColor="var(--chakra-colors-chakra-body-bg)"
      width="100%"
      py="8px"
      px="16px"
    >
      <Flex
        justify="space-between"
        alignItems="center"
      >
        <Text fontSize="sm">Component state:</Text>
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            variant="link"
            colorScheme="ebony"
            rightIcon={<FaChevronDown />}
          >
            {selectValue.label}
          </MenuButton>
          <MenuList zIndex={2}>
            {STATES_SELECT_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => onStateChange(option)}
                {...(selectValue.value === option.value
                  ? {
                      bgColor: activeBgColor,
                    }
                  : {})}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
