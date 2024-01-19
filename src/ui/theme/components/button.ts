import { StyleFunctionProps } from '@chakra-ui/react';

const baseStyle = {
  height: 'auto',
  borderRadius: 'lg',
  borderColor: 'transparent',
  boxShadow: 'none',
  cursor: 'pointer',
  alignItems: 'center',
  transition: '0.2s',
  _disabled: {
    cursor: 'not-allowed !important',
    pointerEvents: 'all !important',
  },
  _hover: {
    transition: '0.1s',
    boxShadow: 'none',
    _disabled: {
      bg: 'initial',
    },
  },
  _focus: {
    outline: 0,
  },
  '&.chakra-button': {
    _hover: {
      transition: '0.1s',
      boxShadow: 'none',
      _disabled: {
        bg: 'initial',
      },
    },
  },
};

const sizes = {
  lg: {
    apply: 'textStyles.body3Semi',
    px: 6,
  },
  md: {
    apply: 'textStyles.body3Semi',
    px: 5,
  },
  sm: {
    apply: 'textStyles.body4Semi',
    px: 3,
  },
};

const getThemeColor = (props: StyleFunctionProps) =>
  props.colorMode === 'light' ? `${props.colorScheme}.600 !important` : `${props.colorScheme}.200 !important`;

const resolveThemeColor = (props: StyleFunctionProps, light: string, dark: string) =>
  props.colorMode === 'light' ? `${light} !important` : `${dark} !important`;

function overrideWebasystButton(props: StyleFunctionProps) {
  const color = getThemeColor(props);

  const disabled = { color };

  const loading = {};

  return {
    _hover: {
      color,
      _disabled: {
        ...disabled,
        _loading: loading,
      },
    },
    _active: {
      top: 0,
    },
    _disabled: {
      ...disabled,
      _loading: loading,
    },
  };
}

const variantSolid = (props: StyleFunctionProps) => {
  const styles = overrideWebasystButton(props);
  const color = props.colorMode === 'light' ? `white !important` : `black !important`;

  const disabled = {
    ...styles._disabled,
    color,
  };

  const hover = {
    ...styles._hover,
    color,
    _disabled: disabled,
  };

  const style = {
    ...styles,
    color,
    _hover: hover,
    _disabled: disabled,
  };

  // To override some WA styles, we will have to use additional selectors.
  // In this case it's '.chakra-button'
  return {
    '&.chakra-button': style,
    ...style,
  };
};

const variantOutline = (props: StyleFunctionProps) => {
  const style = overrideWebasystButton(props);

  // To override some WA styles, we will have to use additional selectors.
  // In this case it's '.chakra-button'
  return {
    '&.chakra-button': style,
    ...style,
  };
};

const variantGhost = (props: StyleFunctionProps) => {
  const style = overrideWebasystButton(props);

  // To override some WA styles, we will have to use additional selectors.
  // In this case it's '.chakra-button'
  return {
    '&.chakra-button': style,
    ...style,
  };
};

const variantLink = (props: StyleFunctionProps) => {
  const styles = overrideWebasystButton(props);
  const style = {
    ...styles,
    _hover: {
      textDecoration: 'none',
      ...styles._hover,
    },
  };

  // To override some WA styles, we will have to use additional selectors.
  // In this case it's '.chakra-button'
  return {
    '&.chakra-button': style,
    ...style,
  };
};

const variantUnit = (props: StyleFunctionProps) => {
  const styles = overrideWebasystButton(props);

  const style = {
    ...styles,
    fontSize: 'xs',
    padding: '4px',
    height: 'auto',
    width: 'min-content',
    minW: 'auto',
    margin: 0,
    borderRadius: 4,
    color: resolveThemeColor(props, 'grey.50', 'grey.200'),
    bgColor: resolveThemeColor(props, 'grey.300', 'grey.900'),
    _hover: {
      textDecoration: 'none',
      ...styles._hover,
      color: resolveThemeColor(props, 'grey.50', 'grey.200'),
      bgColor: resolveThemeColor(props, 'grey.500', 'grey.700'),
    },
  };

  // To override some WA styles, we will have to use additional selectors.
  // In this case it's '.chakra-button'
  return {
    '&.chakra-button': style,
    ...style,
  };
};

const variants = {
  solid: variantSolid,
  outline: variantOutline,
  ghost: variantGhost,
  link: variantLink,
  unit: variantUnit,
};

const defaultProps = {
  variant: 'solid',
  colorScheme: 'dodger',
  size: 'md',
};

export default {
  baseStyle,
  variants,
  sizes,
  defaultProps,
};
