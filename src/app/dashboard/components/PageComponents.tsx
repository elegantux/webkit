import { PropsWithChildren } from 'react';
import { ChakraProps, Heading } from '@chakra-ui/react';

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
