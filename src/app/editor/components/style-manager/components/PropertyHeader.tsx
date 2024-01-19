import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { ClearValueButton } from '@app/editor/components/style-manager/components/ClearValueButton';

export function PropertyHeader({
  propertyLabel,
  hasValue,
  hasInheritedValue,
  onClear,
}: {
  propertyLabel: string;
  hasValue: boolean;
  hasInheritedValue: boolean;
  onClear: Function;
}) {
  const activeLabelColor = useColorModeValue('dodger.500', 'dodger.200');
  return (
    <Flex
      gap="4px"
      align="center"
      mb="4px"
    >
      <Text
        fontSize="sm"
        color={hasValue ? activeLabelColor : 'grey.600'}
      >
        {propertyLabel}
      </Text>
      {hasValue && <ClearValueButton onClick={onClear} />}
      {hasInheritedValue && 'Inherits'}
    </Flex>
  );
}
