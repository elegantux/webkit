import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from '@chakra-ui/react';
import { ChangeEvent, ReactNode, memo, useEffect, useMemo, useState } from 'react';

import { ExtendedProperty } from '@lib/models/grapesjs-extended';
import { UNITS } from '@app/editor/components/style-manager/lib/constant';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { useDraggableValue, useStyleProperty } from '@app/editor/components/style-manager/lib/utils';
import { ClearValueButton } from '@app/editor/components/style-manager/components/ClearValueButton';

// Constants
const NUMBER_REGEX = /^-?\d+$/;
const FLOAT_REGEX = /(^[-]?\d+\.\d+$)/;
const STRING_REGEX =
  /(^[a-zA-Z]+$)|(^[a-zA-Z]+-[a-zA-Z]+$)|(^[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+$)|(^[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+$)/;
const NUMBER_OR_FLOAT_REGEX = /[+-]?([0-9]*[.])?[0-9]+/;

const DEFAULT_NUMBER_VALUE = 100;

export const isString = (value: string | number) => {
  return String(value).match(STRING_REGEX);
};

export const isNumber = (value: string | number) => {
  return String(value).match(NUMBER_REGEX);
};

export const isFloat = (value: string | number) => {
  return String(value).match(FLOAT_REGEX);
};

export const splitNumberAndUnit = (value: string) => {
  const number = String(value).match(NUMBER_OR_FLOAT_REGEX)?.[0] ?? DEFAULT_NUMBER_VALUE;
  const unit = UNITS.find((u) => String(value).includes(u));

  return {
    number: Number(number),
    unit,
  };
};

export const isNumberWithUnit = (value: string | number) => {
  const isValueTypeOfString = typeof value === 'string';
  const isEmpty = isValueTypeOfString && value.length === 0;
  if (isEmpty || !isValueTypeOfString) {
    return false;
  }

  const { number, unit } = splitNumberAndUnit(value);

  return !!(value && value.length > 0 && unit && (isNumber(number) || isFloat(number)) && UNITS.includes(unit));
};

export const getPropertyInitialValue = (property: ExtendedProperty) => (property.hasValue() ? property.getValue() : '');

export const InputProperty = memo(
  ({
    value,
    placeholder = '',
    units,
    options,
    onChange,
    leftAddon,
    clearProperty,
    hasInheritedValue,
    propertyLabel,
  }: {
    value: string;
    placeholder?: string;
    units?: string[];
    options?: SelectOptionProps[] | null;
    onChange: (v: string) => void;
    leftAddon?: ReactNode;
    hasInheritedValue?: boolean;
    clearProperty?: () => void;
    propertyLabel?: any;
  }) => {
    // Local input value before update
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(value);
    const [currentOption, setCurrentOption] = useState<SelectOptionProps | undefined>(undefined);
    const { ref: draggableRef } = useDraggableValue({
      value: Number(inputValue),
      onChange: (v) => {
        const targetValue = String(v);

        if (isNumber(targetValue) || isFloat(targetValue) || isNumberWithUnit(targetValue)) {
          let newValue = '';

          // Get unit from typed value if exist
          const { unit: newUnit, number } = splitNumberAndUnit(targetValue);

          // Get previous unit
          const { unit: oldUnit } = splitNumberAndUnit(value);

          // Update newValue with the new value and current unit
          newValue = newUnit ? `${number}${newUnit}` : `${number}${oldUnit || units![0]}`;

          // Clear error display
          setIsInvalid(false);

          // Update external callback
          onChange(newValue);

          setInputValue(String(number));
        }
      },
    });

    const menuOptions = useMemo(() => {
      const result = [];
      if (units) {
        result.push(...units.map((unit) => ({ label: unit, value: unit })));
      }
      if (options) {
        result.push(...options);
      }
      return result;
    }, [units, options]);

    const isOptionSelected = useMemo(
      () => (options ? options.find((option) => option.value === value) : false),
      [value]
    );

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      // Trim only if there are units or options
      const targetValue = units?.length || options?.length ? event.target.value.trim() : event.target.value;
      const selectedOption = options?.find((o) => o.value === targetValue);

      if (units?.length || options?.length) {
        if (isNumber(targetValue) || isFloat(targetValue) || isNumberWithUnit(targetValue)) {
          let newValue = '';

          // Get unit from typed value if exist
          const { unit: newUnit, number } = splitNumberAndUnit(targetValue);

          // Get previous unit
          const { unit: oldUnit } = splitNumberAndUnit(value);

          // Update newValue with the new value and current unit
          newValue = newUnit ? `${number}${newUnit}` : `${number}${oldUnit || units![0]}`;

          // Clear error display
          setIsInvalid(false);

          // Update external callback
          onChange(newValue);

          setInputValue(String(number));
        } else if (selectedOption) {
          // Else if value is valid css value

          // Clear error display
          setIsInvalid(false);

          // Update external callback
          onChange(String(selectedOption.value));

          setInputValue(String(selectedOption.value));
        } else {
          setIsInvalid(true);

          setInputValue(targetValue);
        }
      } else {
        onChange(targetValue);
        setInputValue(targetValue);
      }
    };

    const handleMenuChange = (option: SelectOptionProps) => {
      const optionValue = option.value;
      const selectedUnit = units?.find((unit) => option.value === unit);
      const selectedOption = options?.find((o) => option.value === o.value);
      // if selected option is unit
      if (selectedUnit) {
        const { number } = splitNumberAndUnit(inputValue);
        const newValue = `${number}${optionValue}`;

        // Update external callback
        onChange(newValue);

        setInputValue(String(number));
      }
      if (selectedOption) {
        // Update external callback
        onChange(String(selectedOption.value));

        setInputValue(String(selectedOption.value));
      }
    };

    const handleValueUpdate = () => {
      if (typeof value === 'string' && value.length === 0) {
        setInputValue('');
        setCurrentOption(menuOptions[0]);
        setIsInvalid(false);
      } else {
        if (isNumber(value) || isFloat(value) || isNumberWithUnit(value)) {
          const { unit, number } = splitNumberAndUnit(value);
          const option = menuOptions.find((o) => o.value === unit);

          setInputValue(String(number));
          setCurrentOption(option);
          setIsInvalid(false);
          return;
        }
        const option = menuOptions.find((o) => o.value === value);

        setInputValue(value);
        setCurrentOption(option);
        setIsInvalid(false);
      }
    };

    useEffect(() => {
      handleValueUpdate();
    }, [value]);

    return (
      <Box position="relative">
        <InputGroup
          variant="style-text"
          size="sm"
          {...(value.length > 0 ? { className: `active ${hasInheritedValue ? 'inherit' : ''}` } : {})}
        >
          {leftAddon && (
            <Tooltip
              label={propertyLabel}
              hasArrow
            >
              <InputLeftAddon ref={draggableRef}>{leftAddon}</InputLeftAddon>
            </Tooltip>
          )}
          <Input
            type="text"
            textAlign="left"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            isInvalid={isInvalid}
            isDisabled={!!isOptionSelected}
            mr="0 !important"
          />
        </InputGroup>
        {menuOptions?.length > 0 && (
          <Box
            position="absolute"
            top="5px"
            right="4px"
          >
            <Menu
              placement="auto"
              isLazy
              lazyBehavior="unmount"
            >
              <ButtonGroup
                variant="unit"
                isAttached
              >
                <MenuButton
                  as={Button}
                  variant="unit"
                >
                  {currentOption?.label}
                </MenuButton>
                {value.length > 0 && (
                  <ClearValueButton
                    variant="unit"
                    color="grey.400"
                    onClick={clearProperty}
                  />
                )}
              </ButtonGroup>
              <MenuList
                zIndex={1}
                minW="auto"
              >
                {menuOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleMenuChange(option)}
                    fontSize="sm"
                    // bgColor={value.includes(String(option.value)) ? 'red' : 'transparent'}
                    className={value.includes(String(option.value)) ? 'active' : ''}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        )}
      </Box>
    );
  }
);

export const InputPropertyType = memo(({ property }: { property: ExtendedProperty }) => {
  const {
    value,
    leftAddon,
    hideLabel,
    hasInheritedValue,
    clearProperty,
    propertyLabel,
    propertyUnits,
    propertyOptions,
  } = useStyleProperty(property);

  const handleInputChange = (v: string) => {
    property.upValue(v);
  };

  return (
    <Flex direction="column">
      {!hideLabel && (
        <PropertyHeader
          propertyLabel={propertyLabel}
          hasInheritedValue={hasInheritedValue}
          hasValue={!!value}
          // onClear={clearProperty}
        />
      )}
      <InputProperty
        value={value}
        units={propertyUnits}
        options={propertyOptions}
        onChange={handleInputChange}
        leftAddon={leftAddon}
        clearProperty={clearProperty}
        hasInheritedValue={hasInheritedValue}
        propertyLabel={propertyLabel}
      />
    </Flex>
  );
});
