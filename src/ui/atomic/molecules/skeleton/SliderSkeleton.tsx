import { Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';

export function SliderSkeleton({ itemsCount = 3 }: { itemsCount?: number }) {
  const startColor = useColorModeValue('grey.50', 'ebony.400');
  const endColor = useColorModeValue('grey.100', 'ebony.500');
  const items = Array.from(Array(itemsCount).keys());

  return (
    <Flex
      gap="34px"
      width="full"
      mb="24px"
    >
      {items.map((item) => (
        <Skeleton
          key={item}
          width="full"
          height="320px"
          borderRadius="4px"
          startColor={startColor}
          endColor={endColor}
        />
      ))}
    </Flex>
  );
}
