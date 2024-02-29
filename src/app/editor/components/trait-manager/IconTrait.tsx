import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { Trait } from 'grapesjs';
import { ChangeEvent, useEffect, useState } from 'react';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';
import { create } from 'zustand';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';

import { Modal, useModal } from '@ui/atomic/organisms/modal';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { EDITOR_COMMANDS } from '@app/editor/lib/constant';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';

const GRID_COLS = 5;
const GRID_CONTAINER_WITH = 744;

type FontAwesomeIcon = { className: string; filter: string };

const useIconTraitStore = create<{
  icon: FontAwesomeIcon | undefined;
  iconList: FontAwesomeIcon[];
  setActiveIcon: (icon: FontAwesomeIcon | undefined) => void;
  setIconList: (iconList: FontAwesomeIcon[]) => void;
}>((set) => ({
  icon: undefined,
  iconList: [],
  setActiveIcon: (icon: FontAwesomeIcon | undefined) => set((state) => ({ ...state, icon })),
  setIconList: (iconList: FontAwesomeIcon[]) => set((state) => ({ ...state, iconList })),
}));

function Cell({ columnIndex, rowIndex, style, data }: GridChildComponentProps) {
  const index = GRID_COLS * rowIndex + columnIndex;
  const icon = data[index];

  const { icon: activeIcon, setActiveIcon } = useIconTraitStore();

  const bgColor = useColorModeValue('grey.100', 'ebony.600');
  const bgHoverColor = useColorModeValue('grey.200', 'ebony.400');

  const handleIconClick = () => {
    setActiveIcon(icon);
  };

  if (!icon) {
    return null;
  }

  return (
    <Box
      p="12px"
      style={style}
    >
      <Box
        key={icon.className}
        textAlign="center"
        bgColor={bgColor}
        pt="18px"
        px="4px"
        width="full"
        height="full"
        borderRadius="8px"
        cursor="pointer"
        transition="background-color 0.2s ease-in-out"
        border="2px solid transparent"
        borderColor={activeIcon?.className === icon?.className ? 'dodger.500' : 'transparent'}
        _hover={{ bgColor: bgHoverColor }}
        onClick={() => handleIconClick()}
      >
        <Box
          as="i"
          fontSize="32px"
          mb="8px"
          className={icon.className}
        />
        <Text fontSize="xs">{icon.filter}</Text>
      </Box>
    </Box>
  );
}

enum ICON_TYPE {
  ALL = 'all',
  SOLID = 'solid',
  REGULAR = 'regular',
  BRANDS = 'brands',
}

function IconList() {
  const iconList = useIconTraitStore((store) => store.iconList);

  const [filteredIconList, setFilteredIconList] = useState<Array<FontAwesomeIcon>>(iconList);
  const [iconType, setIconType] = useState<ICON_TYPE>(ICON_TYPE.ALL);
  const [searchText, setSearchText] = useState<string>('');

  const gridRowCount = +(filteredIconList.length / GRID_COLS).toFixed() + 1;
  const gridColumnWidth = +(GRID_CONTAINER_WITH / GRID_COLS).toFixed();

  const updateIconList = (value: string, type: ICON_TYPE) => {
    let filteredList: FontAwesomeIcon[] = iconList;

    // Filter by search text
    if (value.length > 0) {
      filteredList = iconList.filter((icon) => icon.filter.includes(value));
    }

    // Filter by icon type
    if (type !== ICON_TYPE.ALL) {
      filteredList = filteredList.filter((icon) => icon.className.startsWith(`fa-${type}`));
    }

    if (value.length > 0 || type !== ICON_TYPE.ALL) {
      setFilteredIconList(filteredList);
    } else {
      setFilteredIconList(iconList);
    }

    setSearchText(value);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateIconList(value.trim(), iconType);
  };

  const handleIconTypeChange = (type: ICON_TYPE) => {
    setIconType(type);
    updateIconList(searchText, type);
  };

  const handleClearInput = () => {
    setSearchText('');
    updateIconList('', iconType);
  };

  return (
    <Box mt="32px">
      <Flex
        justify="space-between"
        mb="24px"
      >
        <FormControl width="320px">
          <InputGroup>
            <InputLeftAddon pointerEvents="none">
              <FaMagnifyingGlass color="gray.300" />
            </InputLeftAddon>
            <Input
              value={searchText}
              placeholder="star"
              onChange={handleSearchInputChange}
              autoFocus
            />
            {searchText.length > 0 && (
              <InputRightElement
                onClick={handleClearInput}
                cursor="pointer"
              >
                <FaXmark />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
        <Flex gap="4px">
          {Object.values(ICON_TYPE).map((type) => (
            <Button
              key={type}
              variant={iconType === type ? 'outline' : 'ghost'}
              colorScheme={iconType === type ? 'dodger' : 'grey'}
              borderTop={0}
              borderLeft={0}
              borderRight={0}
              borderRadius="12px 12px 0 0"
              onClick={() => handleIconTypeChange(type)}
            >
              {type}
            </Button>
          ))}
        </Flex>
      </Flex>
      {filteredIconList.length === 0 ? (
        <Flex
          py="142px"
          justify="center"
        >
          <Heading
            size="lg"
            as="p"
          >
            Icon not found: &quot;{searchText}&quot;
          </Heading>
        </Flex>
      ) : (
        <FixedSizeGrid
          columnCount={GRID_COLS}
          rowCount={gridRowCount}
          width={GRID_CONTAINER_WITH}
          columnWidth={gridColumnWidth}
          height={460}
          rowHeight={120}
          itemData={filteredIconList}
        >
          {Cell}
        </FixedSizeGrid>
      )}
    </Box>
  );
}

function IconTraitContent({ trait }: { trait: Trait }) {
  const [value, setValue] = useState<string | undefined>(trait.getValue());

  const theme = useTheme();
  const modal = useModal();
  const activeIcon = useIconTraitStore((store) => store.icon);
  const setActiveIcon = useIconTraitStore((store) => store.setActiveIcon);

  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const hasValue = !!value;
  const traitDefaultValue = trait.getDefault();

  const bgImageColor = useColorModeValue(theme.colors.grey[300], theme.colors.ebony[400]);
  const bgColor = useColorModeValue('grey.100', 'ebony.500');
  const bgImage = `linear-gradient(45deg,${bgImageColor} 25%,transparent 0,transparent 75%,${bgImageColor} 0,${bgImageColor}),linear-gradient(45deg,${bgImageColor} 25%,transparent 0,transparent 75%,${bgImageColor} 0,${bgImageColor})`;

  const handleModalClose = () => {
    setActiveIcon(undefined);
    modal.modalDisclosure.onClose();
  };

  const updateTraitValue = () => {
    component?.set(traitName, activeIcon?.className);
    trait.setValue(activeIcon?.className);
    setValue(activeIcon?.className);

    setActiveIcon(undefined);
    modal.modalDisclosure.onClose();
  };

  const handleClearButton = () => {
    component?.set(traitName, traitDefaultValue);
    trait.setValue(traitDefaultValue);
    setValue(traitDefaultValue);
    setActiveIcon(undefined);
  };

  const updatePropertyStyles = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    setValue(traitValue);
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updatePropertyStyles);
    editor.on('undo', updatePropertyStyles);
    editor.on('redo', updatePropertyStyles);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updatePropertyStyles);
      editor.off('undo', updatePropertyStyles);
      editor.off('redo', updatePropertyStyles);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={hasValue}
      />
      <Box
        position="relative"
        width="full"
        height="120px"
        bgImage={bgImage}
        bgSize="12px 12px"
        bgPosition="0 0,calc(12px / 2) calc(12px / 2)"
        bgColor={bgColor}
        border="1px solid"
        borderColor={bgImageColor}
        borderRadius="4px"
        overflow="hidden"
        role="group"
        cursor="pointer"
        onClick={modal.modalDisclosure.onOpen}
      >
        {hasValue && (
          <Box
            as="i"
            position="absolute"
            inset={0}
            m="auto"
            fontSize="62px"
            width="max-content"
            height="max-content"
            className={value}
          />
        )}
        <Button
          position="absolute"
          width="full"
          bottom="-24px"
          top="unset"
          opacity={0}
          borderRadius={0}
          transition="bottom 0.3s ease, opacity 0.3s ease"
          _groupHover={{
            bottom: '0px',
            opacity: 1,
          }}
          _hover={{ top: 'unset', bottom: 0 }}
          _active={{ top: 'unset', bottom: 0 }}
        >
          Select Icon
        </Button>
      </Box>
      <Modal
        title="Select Icon"
        scrollBehavior="inside"
        isCentered
        minWidth="800px"
        primaryButtonLabel="Insert"
        onPrimaryButtonClick={updateTraitValue}
        primaryButtonEnabled={!!activeIcon}
        showSecondaryButton={false}
        {...modal.modalProps}
        {...modal.modalDisclosure}
        onClose={handleModalClose}
      >
        <IconList />
      </Modal>
    </Box>
  );
}

// Data loader
export function IconTrait({ trait }: { trait: Trait }) {
  const iconList = useIconTraitStore((store) => store.iconList);
  const setIconList = useIconTraitStore((store) => store.setIconList);

  useEffect(() => {
    // Function to lazy load JSON data
    const loadJSONData = async () => {
      // Dynamically import the JSON file
      const jsonModule = await import('../../lib/fa-icons.json');
      // Set the JSON data in state
      setIconList(jsonModule.default);
    };

    // Call the function to load JSON data lazily
    if (iconList.length === 0) {
      loadJSONData();
    }
  }, []);

  if (iconList.length === 0) {
    return 'Loading Icons...';
  }

  return <IconTraitContent trait={trait} />;
}
