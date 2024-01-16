import { StyleFunctionProps } from '@chakra-ui/react';
import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  overlay: {
    bg: 'blackAlpha.200', // change the background
  },
  dialog: {
    borderRadius: 'md',
    bg: `dodger.100`,
  },
});

const variantSidebar = (props: StyleFunctionProps) => {
  return {};
};

const variants = {
  sidebar: variantSidebar,
};

export default defineMultiStyleConfig({
  baseStyle,
  variants,
});
