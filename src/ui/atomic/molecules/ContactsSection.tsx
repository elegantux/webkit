import { Box, ChakraProps, Flex, Link, Text } from '@chakra-ui/react';
import { FaTelegram } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

import { ContentSection } from '@app/dashboard/components/PageComponents';
import { HELP_LINKS } from '@lib/constants.ts';

export function ContactsSection(props: ChakraProps) {
  const { t } = useTranslation();

  return (
    <ContentSection
      borderRadius="6px"
      bgGradient="linear(to-r, #e8f5ff, #f3f5f7)"
      _dark={{ bgGradient: 'linear(to-r, #504d65, #24213f)' }}
      {...props}
    >
      <Box mb="12px">
        <Text
          fontSize="sm"
          mb="12px"
          color="ebony.800"
          _dark={{ color: 'white' }}
        >
          {t('Join our Socials:')}
        </Text>
        <Flex
          as={Link}
          href={HELP_LINKS.TELEGRAM_CHANNEL}
          target="_blank"
          gap="8px"
          color="dodger.400"
          mb="8px"
        >
          <FaTelegram size={20} />
          <Text fontSize="sm">{t('Our News channel')}</Text>
        </Flex>
        <Flex
          as={Link}
          href={HELP_LINKS.TELEGRAM_SUPPORT}
          target="_blank"
          gap="8px"
          color="dodger.400"
        >
          <FaTelegram size={20} />
          <Text fontSize="sm">{t('Support group')}</Text>
        </Flex>
      </Box>
    </ContentSection>
  );
}
