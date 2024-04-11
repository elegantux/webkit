import colors from '@ui/theme/colors';

export const global = () => ({
  // Fancybox
  body: {
    '--fancybox-zIndex': 'var(--chakra-zIndices-modal)',
  },

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
    '--gjs-color-blue': colors.dodger['600'],
    '--gjs-color-green': colors.malachite['500'],
  },
  '.gjs-selected-parent': {
    outlineColor: colors.scarlet['200'],
  },
  '.gjs-toolbar': {
    py: '4px',
    backgroundColor: 'transparent',
  },
  '.gjs-toolbar-items': {
    borderRadius: '2px',
    backgroundColor: 'var(--gjs-color-blue)',
  },
  '.gjs-toolbar-item': {
    borderRadius: '2px',
    padding: '4px',
    '&:hover': {
      bgColor: colors.dodger['700'],
    },
  },
  '.gjs-badge': {
    fontWeight: '600',
    py: '4px',
    px: '0px',
    backgroundColor: 'transparent',
  },
  '.gjs-badge__name': {
    borderRadius: '2px',
    px: '4px',
    backgroundColor: colors.dodger['700'],
  },
  '.gjs-resizer-h': {
    borderRadius: '20px',
  },
  '[data-theme][data-theme=dark]': {
    '--chakra-colors-chakra-body-bg': colors.webasyst.backgroundColor,
  },
  '[data-theme][data-theme=light]': {
    '--chakra-colors-chakra-body-bg': colors.webasyst.backgroundColor,
  },
  '.gjs-cv-canvas-bg': { bgColor: 'transparent' },
  '.gjs-editor.gjs-one-bg': { bgColor: 'transparent' },

  // @uiw/react-color
  "[data-theme*='dark'] .w-color-sketch": {
    '--sketch-background': "var(--background-color, '#07051c') !important",
    '--sketch-swatch-border-top': '1px solid red',
  },

  // Custom classes
  'hide-scrollbar': {
    /* IE and Edge */
    msOverflowStyle: 'none',

    /* Firefox */
    scrollbarWidth: 'none',

    /* Safari and Chrome */
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});
