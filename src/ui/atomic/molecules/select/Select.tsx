import { Box, ChakraProps, Flex, Skeleton, useColorMode, useOutsideClick } from '@chakra-ui/react';
import { PropsWithChildren, ReactElement, ReactNode, Ref, forwardRef, useCallback, useRef } from 'react';
import BaseSelect, {
  ClassNamesConfig,
  ClearIndicatorProps,
  DropdownIndicatorProps,
  GroupBase,
  MultiValueProps,
  MultiValueRemoveProps,
  OptionProps,
  Props,
  StylesConfig,
  ValueContainerProps,
  components,
} from 'react-select';
import {
  FiPlusCircle as AddIcon,
  FiChevronDown as ArrowDownIcon,
  FiCheckCircle as CheckedIcon,
  FiX as ClearIcon,
  FiSearch as SearchIcon,
  FiTrash as TrashIcon,
} from 'react-icons/fi';
import { useHover } from 'usehooks-ts';
import { IconType } from 'react-icons';

import { hexOpacity } from '@ui/theme/utils';
import colors from '@ui/theme/colors';
import theme from '@ui/theme/theme';

export interface SelectOptionProps<Payload = any> {
  value: string | number;
  label: string | ReactNode;
  icon?: IconType;
  payload?: Payload;
}

export type SelectProps = Props & {
  variant?: SELECT_VARIANTS;
  labelText?: string;
  selectContainerProps?: ChakraProps;
  hideSelectedOptions?: boolean;
  hideLabelWhenSelectedValue?: boolean;
  onInputChange?: (value: string) => void;
  onClickOutside?: () => void;
  MultiValue?: (props: MultiValueProps) => ReactElement;
  DropdownIndicator?: (props: DropdownIndicatorProps) => ReactElement;
  ClearIndicator?: (props: ClearIndicatorProps) => ReactElement | null;
  MultiValueRemove?: (props: MultiValueRemoveProps) => ReactElement | null;
  ValueContainer?: (props: ValueContainerRendererProps) => ReactElement;
  OptionItem?: (props: OptionProps) => ReactElement;
  LoadingMessage?: () => ReactElement;
};

export enum SELECT_VARIANTS {
  DEFAULT = 'default',
  STYLE_MANAGER = 'style-manager',
}

const SELECT_CLASS_NAMES: ClassNamesConfig = {
  menuList: () => 'hide-scrollbar',
};

export const SELECT_LIGHT_STYLES: StylesConfig = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 3,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.375rem',
    borderWidth: '1.3px',
    borderColor: hexOpacity(colors.stratos[500], 0.2),
    padding: '4px',
    zIndex: 3,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    '::webkit-scrollbar': {
      display: 'none',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[900],
    padding: '0',
    marginBottom: '4px',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? colors.grey[50] : 'transparent',
    ':hover, :active': {
      backgroundColor: colors.grey[50],
    },
    ':last-of-type': {
      marginBottom: 0,
    },
    transition: 'all 0.1s ease-in-out',
  }),
  control: (base, state) => ({
    ...base,
    ...(state.isDisabled ? { userSelect: 'none' } : {}),
    ...(state.isFocused
      ? {
          backgroundColor: 'white',
        }
      : {
          backgroundColor: hexOpacity(colors.stratos[500], 0.05),
        }),
    opacity: state.isDisabled ? 0.4 : 1,
    borderRadius: '0.375rem',
    outline: 'none',
    boxShadow: 'none',
    border: '2px solid transparent',
    minHeight: '40px',
    ':hover': {
      borderColor: state.isFocused ? colors.dodger[500] : hexOpacity(colors.stratos[500], 0.2),
    },
    ':focus': {
      borderColor: colors.dodger[500],
    },
  }),
  indicatorsContainer: (base) => ({
    ...base,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  }),
  loadingIndicator: (base) => ({
    ...base,
    color: colors.dodger[500],
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
    overflow: 'visible',
    minHeight: '31px',
  }),
  multiValue: (base) => ({
    ...base,
    gap: '2px',
    alignItems: 'center',
    // padding: 0,
    margin: '0 8px 0 0',
    backgroundColor: 'transparent',
    '& > .MultiValueGeneric2': {
      whiteSpace: 'break-spaces',
      color: colors.dodger[500],
    },
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: '16px',
    padding: 0,
    paddingLeft: 0,
    paddingTop: '4px',
    backgroundColor: 'transparent',
  }),
  multiValueRemove: (base) => ({
    ...base,
    padding: '3px',
    height: 'max-content',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: 'transparent',
      color: 'red',
    },
  }),
  input: (base) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[900],
    margin: 0,
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[900],
    marginLeft: 0,
    '& > div[class$="MultiValueGeneric2"]': {
      whiteSpace: 'break-spaces',
    },
  }),
  placeholder: (base, state) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[300],
    marginLeft: 0,
    display: state.isFocused || state.selectProps.inputValue ? 'none' : 'block',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: colors.grey[500],
    padding: '8px 8px',
    cursor: 'pointer',
    ':hover': {
      color: colors.grey[800],
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: colors.dodger[500],
    padding: '8px 4px 10px 4px',
    cursor: 'pointer',
    opacity: 0.6,
    ':hover': {
      color: 'red',
      opacity: 1,
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
};

export const SELECT_DARK_STYLES: StylesConfig = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 3,
  }),
  menu: (base) => ({
    ...base,
    width: 'max-content',
    minWidth: '100%',
    borderRadius: '0.375rem',
    borderWidth: '2px',
    borderColor: hexOpacity(colors.grey[50], 0.3),
    backgroundColor: '#1e1d31',
    padding: '4px',
    zIndex: 3,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    '::webkit-scrollbar': {
      display: 'none',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[50],
    padding: '0',
    marginBottom: '4px',
    borderRadius: '0.325rem',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? hexOpacity(colors.grey[50], 0.1) : 'transparent',
    ':hover, :active': {
      backgroundColor: hexOpacity(colors.grey[50], 0.1),
    },
    ':last-of-type': {
      marginBottom: 0,
    },
  }),
  control: (base, state) => ({
    ...base,
    ...(state.isDisabled ? { userSelect: 'none' } : {}),
    backgroundColor: hexOpacity(colors.grey[50], 0.1),
    opacity: state.isDisabled ? 0.4 : 1,
    borderRadius: '0.375rem',
    outline: 'none',
    boxShadow: 'none',
    border: '2px solid transparent',
    minHeight: '40px',
    ':hover': {
      borderColor: state.isFocused ? colors.dodger[500] : hexOpacity(colors.grey[50], 0.3),
    },
  }),
  indicatorsContainer: (base) => ({
    ...base,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  }),
  loadingIndicator: (base) => ({
    ...base,
    color: colors.dodger[500],
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
    overflow: 'visible',
    minHeight: '31px',
  }),
  multiValue: (base) => ({
    ...base,
    gap: '2px',
    alignItems: 'center',
    // padding: 0,
    margin: '0 8px 0 0',
    backgroundColor: 'transparent',
    '& > .MultiValueGeneric2': {
      whiteSpace: 'break-spaces',
      color: colors.grey[50],
    },
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: '16px',
    padding: 0,
    paddingLeft: 0,
    paddingTop: '4px',
    backgroundColor: 'transparent',
  }),
  multiValueRemove: (base) => ({
    ...base,
    padding: '3px',
    height: 'max-content',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: 'transparent',
      color: 'red',
    },
  }),
  input: (base) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[50],
    margin: 0,
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: '16px',
    color: colors.grey[50],
    marginLeft: 0,
    '& > div[class$="MultiValueGeneric2"]': {
      whiteSpace: 'break-spaces',
    },
  }),
  placeholder: (base, state) => ({
    ...base,
    fontSize: '16px',
    color: hexOpacity(colors.grey[50], 0.2),
    marginLeft: 0,
    display: state.isFocused || state.selectProps.inputValue ? 'none' : 'block',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: colors.grey[500],
    padding: '8px 8px',
    cursor: 'pointer',
    ':hover': {
      color: colors.grey[800],
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: colors.dodger[500],
    padding: '8px 4px 10px 4px',
    cursor: 'pointer',
    opacity: 0.6,
    ':hover': {
      color: 'red',
      opacity: 1,
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
};

const SELECT_LIGHT_STYLE_MANAGER_VARIANT: StylesConfig = {
  ...SELECT_LIGHT_STYLES,
  container: () => ({
    '&.inherit div[class$="-control"]': {
      borderColor: theme.colors.green[500],
    },
  }),
  menu: (base, props) => ({
    ...SELECT_LIGHT_STYLES.menu!(base, props),
    borderRadius: '4px',
    borderWidth: '1px',
    borderColor: hexOpacity(colors.grey[50], 0.3),
    backgroundColor: 'white',
    padding: '4px',
    zIndex: 3,
  }),
  option: (base, state) => ({
    ...SELECT_LIGHT_STYLES.option!(base, state),
    fontSize: '14px',
    fontWeight: '500',
    color: colors.grey[900],
    padding: '0',
    marginBottom: '0px',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: state.isSelected ? hexOpacity(colors.grey['100'], 0.5) : 'transparent',
    ':hover, :active': {
      backgroundColor: colors.grey[50],
    },
    ':last-of-type': {
      marginBottom: 0,
    },
    '& > .option_item': {
      padding: '4px 12px',
    },
  }),
  control: (base, state) => ({
    ...base,
    ...(state.isDisabled ? { userSelect: 'none' } : {}),
    backgroundColor: 'transparent',
    opacity: state.isDisabled ? 0.4 : 1,
    borderRadius: '4px',
    outline: 'none',
    boxShadow: 'none',
    border: `1px solid ${state.hasValue ? colors.dodger[600] : colors.grey[100]}`,
    minHeight: '34px',
    ':hover': {
      borderColor: state.hasValue ? colors.dodger[600] : colors.grey[300],
    },
  }),
  input: (base, props) => ({
    ...SELECT_LIGHT_STYLES.input!(base, props),
    fontSize: '14px',
    fontWeight: '500',
    // color: colors.grey[900],
    // margin: 0,
  }),
  singleValue: (base, props) => ({
    ...SELECT_LIGHT_STYLES.singleValue!(base, props),
    fontSize: '14px',
    fontWeight: '500',
    // color: colors.grey[900],
  }),
  indicatorsContainer: (base, props) => ({
    ...SELECT_LIGHT_STYLES.indicatorsContainer!(base, props),
    flexDirection: 'row-reverse',
    alignItems: 'center',
  }),
  dropdownIndicator: (base, props) => ({
    ...SELECT_LIGHT_STYLES.dropdownIndicator!(base, props),
    padding: '7px',
  }),
  clearIndicator: (base, props) => ({
    ...SELECT_LIGHT_STYLES.clearIndicator!(base, props),
    padding: '0 3px 0 0',
  }),
};

const SELECT_DARK_STYLE_MANAGER_VARIANT: StylesConfig = {
  ...SELECT_LIGHT_STYLE_MANAGER_VARIANT,
  container: (base, props) => ({
    ...SELECT_LIGHT_STYLE_MANAGER_VARIANT.container!(base, props),
    '&.inherit div[class$="-control"]': {
      borderColor: theme.colors.green[200],
    },
  }),
  menu: (base, props) => ({
    ...SELECT_LIGHT_STYLE_MANAGER_VARIANT.menu!(base, props),
    borderColor: colors.ebony[500],
    backgroundColor: colors.ebony[800],
  }),
  option: (base, state) => ({
    ...SELECT_LIGHT_STYLE_MANAGER_VARIANT.option!(base, state),
    color: colors.grey[50],
    backgroundColor: state.isSelected ? hexOpacity(colors.grey['50'], 0.2) : 'transparent',
    ':hover, :active': {
      backgroundColor: hexOpacity(colors.grey['50'], 0.1),
    },
  }),
  control: (base, state) => ({
    ...SELECT_LIGHT_STYLE_MANAGER_VARIANT.control!(base, state),
    color: colors.grey[100],
    backgroundColor: 'transparent',
    border: `1px solid ${state.hasValue ? colors.dodger[700] : colors.ebony[500]}`,
    ':hover': {
      borderColor: state.hasValue ? colors.dodger[700] : colors.ebony[300],
    },
  }),
  input: (base, props) => ({
    ...SELECT_LIGHT_STYLE_MANAGER_VARIANT.input!(base, props),
    color: colors.grey[100],
  }),
  singleValue: (base, props) => ({
    ...SELECT_LIGHT_STYLE_MANAGER_VARIANT.singleValue!(base, props),
    color: colors.grey[100],
  }),
};

const variants = {
  light: {
    [SELECT_VARIANTS.DEFAULT]: SELECT_LIGHT_STYLES,
    [SELECT_VARIANTS.STYLE_MANAGER]: SELECT_LIGHT_STYLE_MANAGER_VARIANT,
  },
  dark: {
    [SELECT_VARIANTS.DEFAULT]: SELECT_DARK_STYLES,
    [SELECT_VARIANTS.STYLE_MANAGER]: SELECT_DARK_STYLE_MANAGER_VARIANT,
  },
};

function DropdownIndicatorRenderer(props: DropdownIndicatorProps) {
  const { isMulti } = props;
  return (
    <components.DropdownIndicator {...props}>
      {isMulti ? <SearchIcon size={18} /> : <ArrowDownIcon size={18} />}
    </components.DropdownIndicator>
  );
}

export function CustomDropdownIndicatorRenderer(props: DropdownIndicatorProps) {
  return <components.DropdownIndicator {...props} />;
}

function ClearIndicatorRenderer(props: ClearIndicatorProps) {
  const { getValue } = props;
  const firstChip = getValue()[0] as any;
  const isFirstChipNotEmpty = firstChip?.value && String(firstChip.value)?.trim()?.length > 0;

  if (isFirstChipNotEmpty) {
    return (
      <components.ClearIndicator {...props}>
        <ClearIcon size={16} />
      </components.ClearIndicator>
    );
  }

  return null;
}

type ValueContainerRendererProps = PropsWithChildren &
  ValueContainerProps & { labelText?: string; searchText: string; hideLabelWhenSelectedValue?: boolean };

function ValueContainerRenderer({
  children,
  hideLabelWhenSelectedValue,
  labelText,
  searchText,
  ...props
}: ValueContainerRendererProps) {
  return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
}

function MultiValueRemoveRenderer() {
  return null;
}

function MultiValueRenderer(props: MultiValueProps) {
  const { children, data, selectProps } = props;

  const selectedValues = selectProps.value as { value: any; label: any }[];
  const currentValue = data as { value: any; label: any };

  return (
    <components.MultiValue
      className="MultiValueGeneric2"
      {...props}
    >
      {children}
      {selectedValues[selectedValues.length - 1]?.value === currentValue?.value ? '' : ','}
    </components.MultiValue>
  );
}

function OptionRenderer(props: OptionProps) {
  const { children, isSelected, isMulti, data } = props;
  const isLoadingOption = (data as any)?.value === -1;

  const optionRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useHover(optionRef);

  let rightIcon = null;
  if (isMulti && !isLoadingOption) {
    if (isHovered && isSelected) {
      rightIcon = (
        <TrashIcon
          size={18}
          color={colors.dodger[500]}
        />
      );
    } else if (!isHovered && isSelected) {
      rightIcon = (
        <CheckedIcon
          size={18}
          color={colors.dodger[500]}
        />
      );
    } else {
      rightIcon = (
        <AddIcon
          size={18}
          color={isHovered ? colors.dodger[500] : hexOpacity(colors.grey[500], 0.3)}
        />
      );
    }
  }

  return (
    <components.Option {...props}>
      <Flex
        className="option_item"
        ref={optionRef}
        align="center"
        justify="space-between"
        padding="10px 8px"
      >
        {children}
        <Box flexShrink={0}>{rightIcon}</Box>
      </Flex>
    </components.Option>
  );
}

export function LoadingMessageRenderer() {
  return (
    <Flex
      color="gray.300"
      fontSize="md"
      justify="center"
      align="center"
      width="full"
      gap="24px"
      py="6px"
    >
      <Skeleton
        width="full"
        height="24px"
        borderRadius="full"
        startColor="fluentHealthSecondary.300"
        endColor="fluentHealthSecondary.500"
      />
      <Skeleton
        width="18px"
        height="18px"
        borderRadius="full"
        flexShrink={0}
        startColor="fluentHealthSecondary.300"
        endColor="fluentHealthSecondary.500"
      />
    </Flex>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Select = forwardRef(
  <Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
    {
      variant = SELECT_VARIANTS.DEFAULT,
      labelText,
      selectContainerProps,
      hideSelectedOptions = false,
      hideLabelWhenSelectedValue,
      onInputChange,
      onClickOutside,
      MultiValue = MultiValueRenderer,
      DropdownIndicator = DropdownIndicatorRenderer,
      ClearIndicator = ClearIndicatorRenderer,
      MultiValueRemove = MultiValueRemoveRenderer,
      ValueContainer = ValueContainerRenderer,
      OptionItem = OptionRenderer,
      LoadingMessage = LoadingMessageRenderer,
      ...props
    }: Props<Option, IsMulti, Group> & SelectProps,
    selectRef: Ref<any>
  ) => {
    const selectContainerRef = useRef<HTMLDivElement | null>(null);
    const searchTextRef = useRef<string>('');
    const uniqueId = `select_${Math.random().toFixed(5).slice(2)}`;
    const mode = useColorMode();
    const styles = variants[mode.colorMode][variant];

    useOutsideClick({
      ref: selectContainerRef,
      handler: () => {
        if (selectRef !== null && 'current' in selectRef && selectRef.current?.props?.menuIsOpen) {
          selectRef?.current?.onMenuClose();
        }
        onClickOutside?.();
      },
    });

    const inputChangeHandler = useCallback((value: string) => {
      if (onInputChange) {
        onInputChange(value);
      }
      searchTextRef.current = value;
    }, []);

    const valueContainerRenderer = useCallback((valueContainerProps: ValueContainerProps) => {
      return (
        <ValueContainer
          labelText={labelText}
          searchText={searchTextRef.current}
          hideLabelWhenSelectedValue={hideLabelWhenSelectedValue}
          {...valueContainerProps}
        />
      );
    }, []);

    return (
      <Box
        ref={selectContainerRef}
        {...selectContainerProps}
      >
        <BaseSelect
          ref={selectRef}
          id={uniqueId}
          placeholder={null}
          closeMenuOnSelect={!props.isMulti}
          hideSelectedOptions={hideSelectedOptions}
          components={{
            MultiValue,
            DropdownIndicator,
            ClearIndicator,
            MultiValueRemove,
            ValueContainer: valueContainerRenderer,
            Option: OptionItem,
            LoadingMessage,
          }}
          styles={styles}
          classNames={SELECT_CLASS_NAMES}
          onInputChange={inputChangeHandler}
          {...props}
        />
      </Box>
    );
  }
);
