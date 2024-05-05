import { numberInputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(numberInputAnatomy.keys);

// const baseStyle = definePartsStyle({});

// const sm = defineStyle({});

// const sizes = {
//   sm: definePartsStyle({ title: sm, description: sm }),
// };

const variantStyleNumber = definePartsStyle({
  stepper: {
    color: 'grey.800',
    borderColor: 'grey.100',
    _dark: {
      color: 'grey.300',
      borderColor: 'ebony.500',
    },
  },
  field: {
    bg: 'transparent !important',
  },
});

const variants = {
  'style-number': variantStyleNumber,
};

export default defineMultiStyleConfig({ variants });
