export const global = () => ({
  // Reset Webasyst styles
  '#wa-nav, #wa-nav:hover': {
    boxShadow: 'none',
  },
  // Reset GJS styles
  ':root': {
    '--gjs-left-width': '0px',
    '--gjs-canvas-top': '0px',
  },
  '[data-theme][data-theme=dark]': {
    // --background-color comes from the wa-...css file
    '--chakra-colors-chakra-body-bg': "var(--background-color, '#07051c')",
  },
  '[data-theme][data-theme=light]': {
    // --background-color comes from the wa-...css file
    '--chakra-colors-chakra-body-bg': "var(--background-color, '#f3f5fa')",
  },
});
