import { StyleFunctionProps } from '@chakra-ui/react';
import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

import colors from '@ui/theme/colors';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // // define the part you're going to style
  // overlay: {
  //   bg: 'blackAlpha.200', // change the background
  // },
  // dialog: {
  //   borderRadius: 'md',
  //   bg: `dodger.100`,
  // },
  dialog: {
    position: 'absolute',
    bottom: { base: '0', md: 'unset' },
    // bg: 'webasyst.backgroundColorBlank',
    bg: `linear-gradient(225deg, ${colors.webasyst.backgroundColor} 0%, ${colors.webasyst.backgroundColorBlank} 99.49%)`,
    px: { base: '16px', md: '24px' },
    py: { base: '22px', md: '20px' },
    borderRadius: { base: '20px 20px 0 0', md: '20px' },
    my: 0,
    maxH: '90vh',
  },
  body: {
    p: '0 4px',
  },
  header: {
    p: 0,
    // color: 'fluentHealthText.100',
    lineHeight: '2',
    mb: '24px',
  },
  closeButton: {
    top: '18px',
    right: '18px',
    // bgColor: 'iris.500',
    color: 'white',
    size: '12px',
    p: '8px',
    borderRadius: '50%',
    sx: {
      '& > svg': {
        width: '12px',
        height: '12px',
      },
    },
  },
});

const variantSidebar = () => {
  return {};
};

const defaultSidebar = (props: StyleFunctionProps) => {
  const closeButtonStyles =
    props.colorMode === 'light'
      ? {
          top: 'var(--chakra-space-4)',
          boxShadow: 'none',
          color: 'gray.600',
          _hover: {
            top: 'var(--chakra-space-4)',
            boxShadow: 'none',
            color: 'gray.600',
            bg: 'gray.200',
          },
        }
      : {
          top: 'var(--chakra-space-4)',
          boxShadow: 'none',
          color: 'gray.50',
          _hover: {
            top: 'var(--chakra-space-4)',
            boxShadow: 'none',
            color: 'gray.50',
            bg: 'gray.600',
          },
        };
  return {
    closeButton: closeButtonStyles,
  };
};

const variants = {
  default: defaultSidebar,
  sidebar: variantSidebar,
};

export default defineMultiStyleConfig({
  baseStyle,
  variants,
});
