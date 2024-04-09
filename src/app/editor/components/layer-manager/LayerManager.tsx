import { Box, useColorModeValue } from '@chakra-ui/react';

export function LayerManager() {
  const itemHoveredBg = useColorModeValue('var(--chakra-colors-stratos-50)', 'var(--chakra-colors-ebony-700)');
  const itemSelectedBg = useColorModeValue('var(--chakra-colors-grey-200)', 'var(--chakra-colors-ebony-400)');
  const itemColor = useColorModeValue('black', 'var(--chakra-colors-grey-100)');

  return (
    <Box
      id="webkit-layer-manager"
      borderLeft="2px solid"
      borderLeftColor="var(--chakra-colors-chakra-border-color)"
      minH="100%"
      overflow="hidden"
      sx={{
        '& .gjs-layer': {
          fontWeight: 'normal',
        },
        '& .gjs-layer-title': {
          fontWeight: 'normal',
        },
        '& .gjs-layer-item': {
          bgColor: 'transparent',
          borderColor: 'var(--chakra-colors-chakra-border-color)',
        },
        '& .gjs-layer.gjs-hovered .gjs-layer-item': {
          '--gjs-soft-light-color': itemHoveredBg,
        },
        '& .gjs-layer.gjs-selected .gjs-layer-item': {
          bgColor: itemSelectedBg,
        },
        '& .gjs-two-color': {
          '--gjs-secondary-color': itemColor,
        },
      }}
    />
  );
}
