import { useTranslation } from 'react-i18next';
import { ChakraProps, Image, Link, Text } from '@chakra-ui/react';

import { ContentSection } from '@app/dashboard/components/PageComponents';

export function GreetingSection(props: ChakraProps) {
  const { t } = useTranslation();

  return (
    <ContentSection
      borderRadius="6px"
      bgGradient="linear(to-r, #e8f5ff, #f3f5f7)"
      _dark={{ bgGradient: 'linear(to-r, #504d65, #24213f)' }}
      {...props}
    >
      <Text
        fontSize="sm"
        mb="12px"
        color="ebony.800"
        _dark={{ color: 'white' }}
      >
        {t('Hey There 👋. Hope you enjoy the app. Consider supporting our app with your comment on ')}
        <Image
          src="/wa-apps/installer/img/installer.svg"
          width="24px"
          mb="-6px"
          mr="4px"
          display="inline-block"
        />
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link
          href="https://www.webasyst.ru/store/app/webkit/reviews/"
          target="_blank"
          color="dodger.500"
          textDecoration="underline"
        >
          Webasyst Store
        </Link>
        .
      </Text>
    </ContentSection>
  );
}
