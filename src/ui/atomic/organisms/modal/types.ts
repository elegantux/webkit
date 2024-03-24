import { ReactNode } from 'react';
import { ChakraProps, HTMLChakraProps, UseDisclosureProps } from '@chakra-ui/react';

export interface IModal extends UseDisclosureProps {
  variant?: string;
  title?: string | ReactNode;
  titleFontSize?: string;
  minWidth?: string;
  scrollBehavior?: 'inside' | 'outside';
  primaryButtonLabel?: string | ReactNode;
  secondaryButtonLabel?: string | ReactNode;
  tertiaryButtonLabel?: string | ReactNode;
  footerAlert?: string | ReactNode;
  primaryButtonVariant?: string;
  secondaryButtonVariant?: string;
  tertiaryButtonVariant?: string;
  primaryButtonColorScheme?: string;
  primaryButtonEnabled?: boolean;
  secondaryButtonEnabled?: boolean;
  tertiaryButtonEnabled?: boolean;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  showTertiaryButton?: boolean;
  showCloseButton?: boolean;
  showModalHeading?: boolean;
  showModalFooter?: boolean;
  isPrimaryButtonLoading?: boolean;
  isTertiaryButtonLoading?: boolean;
  modalContentProps?: ChakraProps & HTMLChakraProps<'section'>;
  onPrimaryButtonClick?: () => any;
  onSecondaryButtonClick?: () => any;
  onTertiaryButtonClick?: () => any;
  isCentered?: boolean;
  [x: string]: any; // this for UseDisclosureProps
}
