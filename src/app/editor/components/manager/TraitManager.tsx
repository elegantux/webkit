import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { Trait, Traits } from 'grapesjs';
import { ColorResult } from '@uiw/color-convert';
import { FaEyeDropper as ColorPickerIcon } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { InputProperty } from '@app/editor/components/style-manager/components/InputPropertyType';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { debounce } from '@lib/utils';
import { SelectProperty } from '@app/editor/components/style-manager/components/SelectPropertyType';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { EDITOR_COMMANDS, TRAIT_TYPES } from '@app/editor/lib/constant';
import { hexOpacity } from '@ui/theme/utils';
import { ColorPicker } from '@app/editor/components/style-manager/components/ColorPropertyType';

function InputTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>(trait.getValue());

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? '';
  const traitOptions = trait
    .getOptions()
    // The trait option type in GrapesJS has "id" and "label" keys, but we use the "value" key instead of "id".
    // @ts-ignore
    ?.map((option) => ({ value: option.value, label: option.label })) as SelectOptionProps[];

  const updateTraitValue = (v: string) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => {
    if (component) {
      return debounce(updateTraitValue, 500);
    }
    return () => {};
  }, [component]);

  const handleInputChange = (v: string) => {
    debouncedUpdateTraitValue(v);
    setValue(v);
  };

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValue(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    if (typeof traitValue === 'string') {
      setValue(traitValue);
    } else {
      setValue('');
    }
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <InputProperty
        value={value}
        options={traitOptions}
        onChange={handleInputChange}
      />
    </Box>
  );
}

function NumberTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>(trait.getValue());

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? '';

  const updateTraitValue = (v: string) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => {
    if (component) {
      return debounce(updateTraitValue, 500);
    }
    return () => {};
  }, [component]);

  const handleInputChange = (v: string) => {
    debouncedUpdateTraitValue(v);
    setValue(v);
  };

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValue(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    setValue(traitValue);
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <NumberInput
        value={value}
        onChange={handleInputChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
}

function ColorTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>(trait.getValue());
  const [displayColor, setDisplayColor] = useState<string>('');

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? '';
  const hasColor = value.length > 0;

  const theme = useTheme();
  const iconColor = useColorModeValue(theme.colors.grey[300], theme.colors.grey[900]);
  const bgColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.05),
    hexOpacity(theme.colors.grey[50], 0.1)
  );

  // Debounce updating the display color
  const updateDisplayColor = useMemo(() => debounce(setDisplayColor, 50), []);

  const updateTraitValue = (v: string) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => {
    if (component) {
      return debounce(updateTraitValue, 500);
    }
    return () => {};
  }, [component]);

  const handleInputChange = useCallback((color: ColorResult) => {
    debouncedUpdateTraitValue(color.hexa);
    setValue(color.hexa);
    updateDisplayColor(color.hexa);
  }, []);

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValue(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    if (typeof traitValue === 'string') {
      setValue(traitValue);
    } else {
      setValue(traitDefaultValue);
    }
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <Popover
        isLazy
        lazyBehavior="unmount"
      >
        <PopoverTrigger>
          <Button
            width="100%"
            bgColor={hasColor ? displayColor : bgColor}
            _hover={{ bgColor: hasColor ? displayColor : bgColor }}
          >
            {!hasColor && <ColorPickerIcon color={iconColor} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent width="auto">
          <PopoverArrow p={2} />
          <PopoverBody p="1px">
            <ColorPicker
              color={value}
              onChange={handleInputChange}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}

function TextareaTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string>(trait.getValue());

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? '';

  const updateTraitValue = (v: string) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => {
    if (component) {
      return debounce(updateTraitValue, 500);
    }
    return () => {};
  }, [component]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    debouncedUpdateTraitValue(event.target.value);
    setValue(event.target.value);
  };

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValue(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    if (typeof traitValue === 'string') {
      setValue(traitValue);
    } else {
      setValue('');
    }
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <Textarea
        value={value}
        onChange={handleInputChange}
      />
    </Box>
  );
}

function CheckboxTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<boolean>(trait.getValue());

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitLabel = trait.getLabel();
  const traitDefaultValue = trait.getDefault() ?? false;
  const traitText = trait.get('text');

  const updateTraitValue = (v: boolean) => {
    component?.set(traitName, v);
    trait.setValue(v);
  };

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => {
    if (component) {
      return debounce(updateTraitValue, 200);
    }
    return () => {};
  }, [component]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedUpdateTraitValue(event.target.checked);
    setValue(event.target.checked);
  };

  const handleClearButton = () => {
    updateTraitValue(traitDefaultValue);
    setValue(traitDefaultValue);
  };

  const updateProperty = () => {
    const lastSelectedComponent = editor.getSelected();
    const traitValue = lastSelectedComponent?.getTrait(trait.getId())?.getValue();
    setValue(traitValue);
  };

  // Update state when:
  // 1. selected
  // 2. deselected
  // 3. removed
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updateProperty);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={false}
      />
      <Checkbox
        isChecked={value}
        onChange={handleChange}
      >
        {traitText}
      </Checkbox>
    </Box>
  );
}

function SelectTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string | number>(trait.getValue());

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitDefaultValue = trait.getDefault() ?? '';
  const options = trait
    .getOptions()
    // The trait option type in GrapesJS has "id" and "label" keys, but we use the "value" key instead of "id".
    // @ts-ignore
    ?.map((option) => ({ value: option.value, label: option.label })) as SelectOptionProps[];

  const selectedValue = options.find((option) => option.value === value) ?? null;

  const handleSelectChange = (option: SelectOptionProps | any) => {
    if (option) {
      component?.set(traitName, option.value);
      trait.setValue(option.value);
      setValue(option.value);
    } else {
      component?.set(traitName, traitDefaultValue);
      trait.setValue(traitDefaultValue);
      setValue(traitDefaultValue);
    }
  };

  const handleClearButton = () => {
    handleSelectChange(null);
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

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updatePropertyStyles);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={trait.getLabel()}
        hasValue={!!selectedValue}
      />
      <SelectProperty
        value={selectedValue}
        options={options}
        onChange={handleSelectChange}
      />
    </Box>
  );
}

function ButtonGroupTrait({ trait }: { trait: Trait }) {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const [value, setValue] = useState<string | number>(trait.getValue());

  const component = editor.getSelected();
  const traitName = trait.getName();
  const traitDefaultValue = trait.getDefault() ?? '';
  const options = trait
    .getOptions()
    // The trait option type in GrapesJS has "id" and "label" keys, but we use the "value" key instead of "id".
    // @ts-ignore
    ?.map((option) => ({ value: option.value, label: option.label })) as SelectOptionProps[];

  const selectedValue = options.find((option) => option.value === value) ?? null;

  const theme = useTheme();
  const color = useColorModeValue('grey.900', 'grey.300');
  const activeColor = useColorModeValue('dodger.500', 'dodger.200');
  const bgColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.05),
    hexOpacity(theme.colors.grey[50], 0.1)
  );
  const activeBgColor = useColorModeValue(theme.colors.dodger[100], hexOpacity(theme.colors.dodger[50], 0.3));
  const borderColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.2),
    hexOpacity(theme.colors.grey[50], 0.2)
  );
  const focusedBorderColor = useColorModeValue(hexOpacity(theme.colors.stratos[500], 0.2), theme.colors.dodger[500]);

  const handleChange = (v: SelectOptionProps['value']) => {
    component?.set(traitName, v);
    trait.setValue(v);
    setValue(v);
  };

  const handleClearButton = () => {
    component?.set(traitName, traitDefaultValue);
    trait.setValue(traitDefaultValue);
    setValue(traitDefaultValue);
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

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY}`, updatePropertyStyles);
    };
  }, [editor]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={trait.getLabel()}
        hasValue={!!selectedValue}
      />
      <ButtonGroup
        size="md"
        variant="outline"
        width="full"
        isAttached
      >
        {options.map((option) => (
          <Tooltip
            hasArrow
            key={option.value}
            label={option.label}
          >
            <IconButton
              aria-label=""
              onClick={() => handleChange(option.value)}
              icon={option.icon?.({ size: '18px' }) ?? <Text>{option.value}</Text>}
              color={value === option.value ? activeColor : color}
              flex={1}
              borderColor="transparent"
              backgroundColor={value === option.value ? activeBgColor : bgColor}
              _groupHover={{ borderColor: value === option.value ? focusedBorderColor : borderColor }}
            />
          </Tooltip>
        ))}
      </ButtonGroup>
    </Box>
  );
}

export function TraitManager() {
  const [traitList, setTraitList] = useState<Traits | undefined>(undefined);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const handleUpdateTraitList = () => {
    const selectedComponent = editor.getSelected();

    if (selectedComponent) {
      // Get a new instance of the traits model to update the link and user interface.
      // Otherwise, the link will remain the same and the user interface will not update.
      // https://arc.net/l/quote/ztapwusb
      // TODO: Be careful with performance
      const componentTraitList = selectedComponent.get('traits')?.clone();
      setTraitList(componentTraitList);
      editor.runCommand(EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY);
    } else {
      setTraitList(undefined);
    }
  };

  useEffect(() => {
    editor.on('component:selected', handleUpdateTraitList);
    editor.on('component:deselected', handleUpdateTraitList);
    editor.on('component:remove', handleUpdateTraitList);

    // Run the callback on first mount to update traits UI
    handleUpdateTraitList();

    return () => {
      editor.off('component:selected', handleUpdateTraitList);
      editor.off('component:deselected', handleUpdateTraitList);
      editor.off('component:remove', handleUpdateTraitList);
    };
  }, []);

  // Update state when:
  // 1. Someone manually triggered a re-rendering
  useEffect(() => {
    editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY_LIST}`, handleUpdateTraitList);

    return () => {
      editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY_LIST}`, handleUpdateTraitList);
    };
  }, []);

  return (
    <>
      {traitList?.length === 0 && (
        <Flex
          direction="column"
          alignItems="center"
          py="36px"
          px="16px"
        >
          <Heading
            size="md"
            textAlign="center"
          >
            There are no settings for this component
          </Heading>
          <Text fontSize="42px">🤷</Text>
        </Flex>
      )}
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={3}
        p="16px"
      >
        {traitList?.map((trait) => (
          <GridItem
            key={trait.getId()}
            colSpan={trait.get('colSpan') ?? 2}
          >
            {trait.getType() === TRAIT_TYPES.TEXT && <InputTrait trait={trait} />}
            {trait.getType() === TRAIT_TYPES.NUMBER && <NumberTrait trait={trait} />}
            {trait.getType() === TRAIT_TYPES.TEXTAREA && <TextareaTrait trait={trait} />}
            {trait.getType() === TRAIT_TYPES.CHECKBOX && <CheckboxTrait trait={trait} />}
            {trait.getType() === TRAIT_TYPES.SELECT && <SelectTrait trait={trait} />}
            {trait.getType() === TRAIT_TYPES.BUTTON_GROUP && <ButtonGroupTrait trait={trait} />}
            {trait.getType() === TRAIT_TYPES.COLOR && <ColorTrait trait={trait} />}
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
