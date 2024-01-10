// https://medium.com/meliopayments/why-we-chose-chakra-ui-for-our-design-system-part-2-36865e5ec2be
import { theme as defaultTheme, extendTheme } from '@chakra-ui/react';

import { WA_THEME_MODE_LS_KEY } from '@lib/constants';

const theme = extendTheme(
  {
    // components,
    // ...typography,
    // ...foundations,
  },
  {
    config: {
      ...defaultTheme.config,
      initialColorMode: localStorage.getItem(WA_THEME_MODE_LS_KEY),
      useSystemColorMode: false,
    },
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
