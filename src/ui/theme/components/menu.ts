import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

import colors from '@ui/theme/colors';
import { hexOpacity } from '@ui/theme/utils';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  // button: {
  //   // this will style the MenuButton component
  //   fontWeight: 'medium',
  //   bg: 'teal.500',
  //   color: 'gray.200',
  //   _hover: {
  //     bg: 'teal.600',
  //     color: 'white',
  //   },
  // },
  list: {
    px: '4px',
    py: '4px',
    _dark: {
      bgColor: 'ebony.800',
    },
  },
  item: {
    color: 'grey.900',
    bgColor: 'transparent',
    boxShadow: 'none',
    transitionDuration: '0.1s',
    py: '6px',
    _hover: {
      color: 'grey.900',
      bg: 'grey.50',
      boxShadow: 'none',
    },
    _focus: {
      color: 'grey.900',
      bg: 'grey.50',
      boxShadow: 'none',
    },
    _dark: {
      color: 'grey.50',
      _hover: {
        bg: hexOpacity(colors.grey['50'], 0.1),
      },
      _focus: {
        bg: hexOpacity(colors.grey['50'], 0.1),
      },
    },
  },
  groupTitle: {
    opacity: '0.7',
    mx: '4px',
    px: '4px',
  },
  // command: {
  // },
  // divider: {
  //   // this will style the MenuDivider component
  //   my: '4',
  //   borderColor: 'white',
  //   borderBottom: '2px dotted',
  // },
});

export default defineMultiStyleConfig({
  baseStyle,
  // variants,
});
