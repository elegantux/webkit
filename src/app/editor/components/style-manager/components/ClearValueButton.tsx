import { FaXmark as XIcon } from 'react-icons/fa6';
import { IconButton } from '@chakra-ui/react';

export function ClearValueButton({ onClick }: { onClick?: Function }) {
  return (
    <IconButton
      variant="ghost"
      aria-label="Clear Button"
      size="xs"
      minW="auto"
      height="auto"
      icon={<XIcon />}
      onClick={() => onClick?.()}
    />
  );
}
