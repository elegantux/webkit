import colors from '@ui/theme/colors';

export const global = () => ({
  // Reset Webasyst styles
  '#wa-nav, #wa-nav:hover': {
    // boxShadow: 'none',
  },
  p: {
    margin: 'unset',
  },
  // Reset GJS styles
  ':root': {
    '--gjs-left-width': '0px',
    '--gjs-canvas-top': '0px',
  },
  '[data-theme][data-theme=dark]': {
    '--chakra-colors-chakra-body-bg': colors.webasyst.backgroundColorBlank,
  },
  '[data-theme][data-theme=light]': {
    '--chakra-colors-chakra-body-bg': colors.webasyst.backgroundColorBlank,
  },
  // @uiw/react-color
  "[data-theme*='dark'] .w-color-sketch": {
    '--sketch-background': "var(--background-color, '#07051c') !important",
    '--sketch-swatch-border-top': '1px solid red',
  },
});
