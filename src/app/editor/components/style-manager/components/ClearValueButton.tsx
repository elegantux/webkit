import { FaXmark as XIcon } from 'react-icons/fa6';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

export function ClearValueButton(props: Omit<IconButtonProps, 'aria-label'>) {
  return (
    <IconButton
      variant="ghost"
      aria-label="Clear Button"
      size="xs"
      minW="auto"
      height="auto"
      icon={<XIcon />}
      {...props}
    />
  );
}
