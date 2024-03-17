import { ChakraProps, Container } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export function PageContainer(props: PropsWithChildren<ChakraProps>) {
  return (
    <Container
      maxW="1200px"
      width="100%"
      padding="3rem 5rem"
      {...props}
    />
  );
}
