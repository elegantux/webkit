import { Flex, Text, Tooltip, useColorModeValue, useTheme } from '@chakra-ui/react';
import { FaCircleInfo } from 'react-icons/fa6';

import { ClearValueButton } from '@app/editor/components/style-manager/components/ClearValueButton';

export function PropertyHeader({
  propertyLabel,
  hasValue,
  hasInheritedValue,
  onClear,
}: {
  propertyLabel: string;
  hasValue?: boolean;
  hasInheritedValue?: boolean;
  onClear?: Function;
}) {
  const theme = useTheme();
  const activeLabelColor = useColorModeValue('dodger.500', 'dodger.200');
  const activeLabelWithParentValueColor = useColorModeValue(theme.colors.orange[500], theme.colors.orange[200]);

  let labelColor: string = 'grey.600';
  if (hasInheritedValue) {
    labelColor = activeLabelWithParentValueColor;
  } else if (hasValue) {
    labelColor = activeLabelColor;
  }

  return (
    <Flex
      gap="4px"
      align="center"
      mb="4px"
      position="relative"
    >
      <Text
        fontSize="sm"
        color={labelColor}
      >
        {propertyLabel}
      </Text>
      {hasValue && !hasInheritedValue && <ClearValueButton onClick={onClear} />}
      {hasValue && hasInheritedValue && (
        <Tooltip
          label="The value of this property is derived from the CSS rules related to this component."
          fontSize="12px"
          borderRadius="4px"
          hasArrow
        >
          <Text>
            <FaCircleInfo
              size={12}
              style={{ color: activeLabelWithParentValueColor }}
            />
          </Text>
        </Tooltip>
      )}
    </Flex>
  );
}
