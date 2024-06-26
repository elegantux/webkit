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
import { Trait } from 'grapesjs';
import { ColorResult } from '@uiw/color-convert';
import { FaEyeDropper as ColorPickerIcon } from 'react-icons/fa6';

import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { InputProperty } from '@app/editor/components/style-manager/components/InputPropertyType';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { debounce } from '@lib/utils';
import { SelectProperty } from '@app/editor/components/style-manager/components/SelectPropertyType';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { TRAIT_TYPES } from '@app/editor/lib/constant';
import { hexOpacity } from '@ui/theme/utils';
import { ColorPicker } from '@app/editor/components/style-manager/components/ColorPropertyType';
import { IconTrait } from '@app/editor/components/trait-manager/IconTrait';
import { ImageTrait } from '@app/editor/components/trait-manager/ImageTrait';
import { CodeEditorTrait } from '@app/editor/components/trait-manager/CodeEditorTrait';
import { ButtonTrait } from '@app/editor/components/trait-manager/ButtonTrait';
import { CssRuleManagerButtonTrait } from '@app/editor/components/trait-manager/CssRuleManagerButtonTrait';
import { KeyValueTrait } from '@app/editor/components/trait-manager/KeyValueTrait';
import { useTraitProperty } from '@app/editor/components/trait-manager/lib/utils';

function InputTrait({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, clearTraitValue, traitPlaceholder, traitLabel, traitOptions } =
    useTraitProperty(trait, '');

  const debouncedUpdateTraitValue = useMemo(() => {
    return debounce(updateTraitValue, 500);
  }, [trait]);

  const handleInputChange = (v: string) => {
    debouncedUpdateTraitValue(v);
    setValue(v);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={clearTraitValue}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <InputProperty
        value={value}
        placeholder={traitPlaceholder}
        options={traitOptions}
        onChange={handleInputChange}
      />
    </Box>
  );
}

function NumberTrait({ trait }: { trait: Trait }) {
  const {
    value,
    setValue,
    updateTraitValue,
    clearTraitValue,
    traitMinValue,
    traitMaxValue,
    traitLabel,
    traitStep,
    traitDebounce,
  } = useTraitProperty(trait, '');

  const debouncedUpdateTraitValue = useMemo(() => {
    return debounce(updateTraitValue, traitDebounce);
  }, [trait]);

  const handleInputChange = (v: string) => {
    if (typeof traitMinValue !== 'undefined' && Number(v) < traitMinValue) {
      return;
    }
    if (typeof traitMaxValue !== 'undefined' && Number(v) > traitMaxValue) {
      return;
    }

    debouncedUpdateTraitValue(v);
    setValue(v);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={clearTraitValue}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <NumberInput
        value={value}
        onChange={handleInputChange}
        {...(traitMinValue ? { min: traitMinValue } : {})}
        {...(traitMaxValue ? { max: traitMaxValue } : {})}
        {...(traitStep ? { step: traitStep } : {})}
      >
        <NumberInputField value={value} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
}

function ColorTrait({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, clearTraitValue, traitLabel, traitDefaultValue } = useTraitProperty(
    trait,
    ''
  );
  const [displayColor, setDisplayColor] = useState<string>(value);

  const hasColor = value.length > 0;

  const theme = useTheme();
  const iconColor = useColorModeValue(theme.colors.grey[300], theme.colors.grey[900]);
  const bgColor = useColorModeValue(
    hexOpacity(theme.colors.stratos[500], 0.05),
    hexOpacity(theme.colors.grey[50], 0.1)
  );

  // Debounce updating the display color
  const updateDisplayColor = useMemo(() => debounce(setDisplayColor, 50), [trait]);

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => debounce(updateTraitValue, 500), [trait]);

  const handleInputChange = useCallback(
    (color: ColorResult) => {
      debouncedUpdateTraitValue(color.hexa);
      setValue(color.hexa);
      updateDisplayColor(color.hexa);
    },
    [trait]
  );

  const handleClearButton = () => {
    clearTraitValue();
    setDisplayColor(traitDefaultValue);
  };

  useEffect(() => {
    setValue(trait.getValue());
    setDisplayColor(trait.getValue());
  }, [trait]);

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
  const { value, setValue, updateTraitValue, clearTraitValue, traitDescription, traitLabel } = useTraitProperty(
    trait,
    ''
  );

  // Debounce updating the display color
  const debouncedUpdateTraitValue = useMemo(() => debounce(updateTraitValue, 500), [trait]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    debouncedUpdateTraitValue(event.target.value);
    setValue(event.target.value);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={clearTraitValue}
        propertyLabel={traitLabel}
        hasValue={!!value}
      />
      <Textarea
        value={value}
        onChange={handleInputChange}
      />
      {traitDescription && <Box dangerouslySetInnerHTML={{ __html: traitDescription }} />}
    </Box>
  );
}

function CheckboxTrait({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, clearTraitValue, traitText, traitLabel } = useTraitProperty<boolean>(
    trait,
    false
  );

  const debouncedUpdateTraitValue = useMemo(() => debounce(updateTraitValue, 200), [trait]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedUpdateTraitValue(event.target.checked);
    setValue(event.target.checked);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={clearTraitValue}
        propertyLabel={traitLabel}
        hasValue={false}
      />
      <Checkbox
        isChecked={value}
        onChange={handleChange}
      >
        <Text fontSize="sm">{traitText}</Text>
      </Checkbox>
    </Box>
  );
}

function SelectTrait({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, traitDefaultValue, traitOptions } = useTraitProperty<string>(trait, '');

  const selectedValue = traitOptions.find((option) => option.value === value) ?? null;

  const handleSelectChange = (option: SelectOptionProps | any) => {
    if (option) {
      updateTraitValue(option.value);
      setValue(option.value);
    } else {
      updateTraitValue(traitDefaultValue);
      setValue(traitDefaultValue);
    }
  };

  const handleClearButton = () => {
    handleSelectChange(null);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={trait.getLabel()}
        hasValue={!!selectedValue}
      />
      <SelectProperty
        value={selectedValue}
        options={traitOptions}
        onChange={handleSelectChange}
      />
    </Box>
  );
}

function ButtonGroupTrait({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, clearTraitValue, traitOptions } = useTraitProperty<string | number>(
    trait,
    ''
  );

  const selectedValue = traitOptions.find((option) => option.value === value) ?? null;

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
    updateTraitValue(v);
    setValue(v);
  };

  useEffect(() => {
    setValue(trait.getValue());
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={clearTraitValue}
        propertyLabel={trait.getLabel()}
        hasValue={!!selectedValue}
      />
      <ButtonGroup
        size="md"
        variant="outline"
        width="full"
        isAttached
      >
        {traitOptions.map((option) => (
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
  const [traitList, setTraitList] = useState<Trait[] | undefined>(undefined);
  const editor = useEditorStore(EDITOR_STORE.EDITOR);

  const groupedTraitList: Record<string, Trait[]> = useMemo(() => {
    if (!traitList || traitList.length === 0) {
      return {};
    }

    const groups: Record<string, Trait[]> = {
      default: [],
    };

    traitList.forEach((trait) => {
      // @ts-ignore
      const group = trait.get('group');

      if (group) {
        if (groups[group]) {
          groups[group].push(trait);
        } else {
          groups[group] = [trait];
        }
      } else {
        groups.default.push(trait);
      }
    });
    return groups;
  }, [traitList]);

  const handleUpdateTraitList = () => {
    // Remove the trait type TRAIT_TYPES.CHILD_SELECTOR since it has no settings.
    const traitListWithoutChildSelectors = editor.Traits.getTraits().filter(
      (trait) => trait.getType() !== TRAIT_TYPES.CHILD_SELECTOR
    );
    setTraitList(traitListWithoutChildSelectors);
    // editor.runCommand(EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY);
  };

  useEffect(() => {
    editor.on('trait:custom', handleUpdateTraitList);

    // Run the callback on first mount to update traits UI
    // handleUpdateTraitList();

    return () => {
      editor.off('trait:custom', handleUpdateTraitList);
    };
  }, []);

  // Update state when:
  // 1. Someone manually triggered a re-rendering
  // useEffect(() => {
  //   editor.on(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY_LIST}`, handleUpdateTraitList);
  //
  //   return () => {
  //     editor.off(`run:${EDITOR_COMMANDS.UPDATE_TRAIT_MANAGER_PROPERTY_LIST}`, handleUpdateTraitList);
  //   };
  // }, []);

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
      {Object.keys(groupedTraitList).map((group: string) => (
        <Box
          key={group}
          mb="14px"
          py="16px"
          bgColor="webasyst.backgroundColorBlank"
        >
          <Heading
            px="16px"
            size="sm"
            fontWeight="600"
            mb="0px"
          >
            {group === 'default' ? 'Common' : group}
          </Heading>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={3}
            p="16px"
          >
            {groupedTraitList[group]?.map((trait) => (
              <GridItem
                key={trait.getId()}
                // @ts-ignore
                colSpan={trait.get('colSpan') ?? 2}
              >
                {trait.getType() === TRAIT_TYPES.TEXT && <InputTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.NUMBER && <NumberTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.TEXTAREA && <TextareaTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.CHECKBOX && <CheckboxTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.SELECT && <SelectTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.BUTTON_GROUP && <ButtonGroupTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.COLOR && <ColorTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.ICON && <IconTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.IMAGE && <ImageTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.CODE_EDITOR && <CodeEditorTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.BUTTON && <ButtonTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.CSS_RULE_MANAGER_BUTTON && <CssRuleManagerButtonTrait trait={trait} />}
                {trait.getType() === TRAIT_TYPES.KEY_VALUE && <KeyValueTrait trait={trait} />}
              </GridItem>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
}
