import { ChakraProps, Flex, Image } from '@chakra-ui/react';

import { appPath } from '@lib/utils';

export function AppLoadingState(props: ChakraProps) {
  return (
    <Flex
      justify="center"
      align="center"
      height="calc(100% - 64px)"
      {...props}
    >
      <Image
        fallbackSrc={appPath('/img/webkit.svg')}
        filter="grayscale(100%)"
        alt="App Loading State"
        width="auto"
        borderRadius="lg"
        opacity={0.2}
      />
    </Flex>
  );
}
