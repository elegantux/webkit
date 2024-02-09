import { Box, Flex, Skeleton } from '@chakra-ui/react';

export function FormSkeleton() {
  return (
    <Box py="24px">
      <Skeleton
        height="34px"
        borderRadius="4px"
        startColor="grey.300"
        endColor="grey.500"
        mb="24px"
      />
      <Flex
        gap="24px"
        width="full"
        mb="24px"
      >
        <Skeleton
          width="full"
          height="34px"
          borderRadius="4px"
          startColor="grey.300"
          endColor="grey.500"
        />
        <Skeleton
          width="full"
          height="34px"
          borderRadius="4px"
          startColor="grey.300"
          endColor="grey.500"
        />
      </Flex>
      <Skeleton
        height="34px"
        borderRadius="4px"
        startColor="grey.300"
        endColor="grey.500"
        mb="24px"
      />
      <Skeleton
        height="64px"
        borderRadius="4px"
        startColor="grey.300"
        endColor="grey.500"
      />
    </Box>
  );
}
