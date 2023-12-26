// https://medium.com/meliopayments/why-we-chose-chakra-ui-for-our-design-system-part-2-36865e5ec2be

import { theme as defaultTheme, extendTheme } from '@chakra-ui/react';

const theme = extendTheme(
  {
    // components,
    // ...typography,
    // ...foundations,
  },
  {
    config: defaultTheme.config,
    direction: defaultTheme.direction,
    transition: defaultTheme.transition,
    // breakpoints,
    zIndices: defaultTheme.zIndices,
    components: {},
    styles: {},
    borders: {},
    colors: {},
    radii: {},
    shadows: {},
    sizes: {},
    space: {},
    fonts: {},
    fontSizes: {},
    fontWeights: {},
    letterSpacings: {},
    lineHeights: {},
  }
);
export default theme;
