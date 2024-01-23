export const global = () => ({
  // Reset Webasyst styles
  '#wa-nav, #wa-nav:hover': {
    boxShadow: 'none',
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
    // --background-color comes from the wa-...css file
    // --background-color-blank comes from the wa-...css file
    '--chakra-colors-chakra-body-bg': "var(--background-color, '#07051c')",
    '--chakra-colors-chakra-body-bg-blank': "var(--background-color-blank, '#19172c')",
  },
  '[data-theme][data-theme=light]': {
    // --background-color comes from the wa-...css file
    // --background-color-blank comes from the wa-...css file
    '--chakra-colors-chakra-body-bg': "var(--background-color, '#f3f5fa')",
    '--chakra-colors-chakra-body-bg-blank': "var(--background-color-blank, '#ffffff')",
  },
  // @uiw/react-color
  "[data-theme*='dark'] .w-color-sketch": {
    '--sketch-background': "var(--background-color, '#07051c') !important",
    '--sketch-swatch-border-top': '1px solid red',
  },
});
