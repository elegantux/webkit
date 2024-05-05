import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { hexOpacity } from '@ui/theme/utils';
import colors from '@ui/theme/colors';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

// const baseStyle = definePartsStyle({});

// const sm = defineStyle({});

// const sizes = {
//   sm: definePartsStyle({ title: sm, description: sm }),
// };

const variantStyleText = definePartsStyle({
  group: {
    border: '1px solid',
    borderColor: 'grey.100',
    borderRadius: '4px',
    '&.active': {
      borderColor: 'dodger.600 !important',
    },
    '&.inherit': {
      borderColor: 'green.500 !important',
    },
    _dark: {
      borderColor: 'ebony.500',
      '&.active': {
        borderColor: 'dodger.700 !important',
      },
      '&.inherit': {
        borderColor: 'green.200 !important',
      },
    },
  },
  addon: {
    cursor: 'ew-resize',
    minW: '34px',
    justifyContent: 'center',
    color: 'grey.700',
    bgColor: hexOpacity(colors.grey[100], 0.5),
    px: '6px',
    userSelect: 'none',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    _dark: {
      bgColor: hexOpacity(colors.grey[100], 0.1),
    },
  },
  field: {
    bg: 'transparent !important',
  },
});

const variants = {
  'style-text': variantStyleText,
};

export default defineMultiStyleConfig({ variants });
