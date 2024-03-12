import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { StyleFunctionProps } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({});

const variantSidebar = (prop: StyleFunctionProps) => {
  const closeButtonStyles =
    prop.colorMode === 'light'
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
    dialogContainer: {
      pointerEvents: 'none',
    },
    overlay: {
      bg: 'transparent',
      pointerEvents: 'none',
    },
    dialog: {
      pointerEvents: 'all',
      bg: "var(--background-color, '#f3f5fa')",
      borderRight: '2px solid',
      borderRightColor: 'var(--chakra-colors-chakra-border-color)',
    },
    closeButton: closeButtonStyles,
  };
};

const variantSidebarWithTransparentOverlay = (prop: StyleFunctionProps) => {
  return {
    ...variantSidebar(prop),
    dialogContainer: {
      pointerEvents: 'all',
    },
    overlay: {
      bg: 'transparent',
      pointerEvents: 'all',
    },
  };
};

const variants = {
  sidebar: variantSidebar,
  'sidebar-with-transparent-overlay': variantSidebarWithTransparentOverlay,
};

export default defineMultiStyleConfig({
  baseStyle,
  variants,
});
