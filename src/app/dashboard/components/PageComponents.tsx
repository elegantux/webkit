import { PropsWithChildren } from 'react';
import { Box, ChakraProps, Heading } from '@chakra-ui/react';

export function PageHeading(props: PropsWithChildren<ChakraProps>) {
  return (
    <Heading
      color="grey.800"
      _dark={{ color: 'grey.200' }}
      mb={12}
      {...props}
    />
  );
}

export function ContentSection(props: PropsWithChildren<ChakraProps>) {
  return (
    <Box
      borderRadius="24px"
      bgColor="white"
      _dark={{ bgColor: 'ebony.800' }}
      padding="24px"
      {...props}
    />
  );
}
