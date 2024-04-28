import { alertAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    borderRadius: '4px',
  },
});

const sm = defineStyle({
  fontSize: '14',
});

const sizes = {
  sm: definePartsStyle({ title: sm, description: sm }),
};

// const variantTest = definePartsStyle({});
//
// const variants = {
//   test: variantTest,
// };

// const defaultProps = {
//   variant: 'solid',
//   colorScheme: 'dodger',
//   size: 'md',
// };

export default defineMultiStyleConfig({ baseStyle, sizes });
