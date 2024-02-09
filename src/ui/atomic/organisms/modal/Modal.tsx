// Package modules
import {
  Box,
  Button,
  Modal as ChakraModal,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn,
  useDisclosure,
} from '@chakra-ui/react';
import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useIntersected } from '@lib/utils/utils';
import { IModal } from '@ui/atomic/organisms/modal/types';

export enum MODAL_VARIANTS {
  DEFAULT = 'default',
  SHARING = 'sharing',
  PERIWINKLE = 'periwinkle',
}

enum SCROLL_OVERFLOW_INDICATOR_POSITION {
  NONE,
  TOP,
  MIDDLE,
  BOTTOM,
}

export function Modal(props: PropsWithChildren<IModal>) {
  const {
    // Modal props
    variant = MODAL_VARIANTS.DEFAULT,
    title,
    titleFontSize = '2xl',
    minWidth = '560px',
    scrollBehavior,
    primaryButtonLabel = 'Submit',
    secondaryButtonLabel = 'Cancel',
    tertiaryButtonLabel = 'Previous',
    footerAlert = null,
    primaryButtonVariant = 'solid',
    secondaryButtonVariant = 'quiet',
    tertiaryButtonVariant = 'quiet',
    primaryButtonColorScheme = 'dodger',
    primaryButtonEnabled = true,
    secondaryButtonEnabled = true,
    tertiaryButtonEnabled = true,
    showPrimaryButton = true,
    showSecondaryButton = true,
    showTertiaryButton = false,
    showCloseButton = true,
    showModalHeading = true,
    showModalFooter = true,
    isPrimaryButtonLoading = false,
    isTertiaryButtonLoading = false,
    modalContentProps = {},
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    onTertiaryButtonClick,

    // Disclosure props
    isOpen,
    onClose,
    children,
  } = props;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  let HeadingComponent = null;
  if (typeof title === 'string') {
    HeadingComponent = (
      <Heading
        fontSize={titleFontSize}
        color="fluentHealthText.100"
        paddingRight="32px"
      >
        {title}
      </Heading>
    );
  } else {
    HeadingComponent = title;
  }

  const [scrollOverflowIndicator, setScrollOverflowIndicator] = useState<SCROLL_OVERFLOW_INDICATOR_POSITION>(
    SCROLL_OVERFLOW_INDICATOR_POSITION.NONE
  );
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const intersectedBody = useIntersected(bodyRef);

  const updateScrollOverflowIndicator = useCallback(() => {
    if (bodyRef?.current) {
      const position = bodyRef.current.scrollHeight - bodyRef.current.clientHeight;
      const isTop = bodyRef.current.scrollTop === 0;
      const isBottom = position === bodyRef?.current.scrollTop;

      if (position === 0) {
        setScrollOverflowIndicator(SCROLL_OVERFLOW_INDICATOR_POSITION.NONE);
      } else if (!isTop && !isBottom) {
        setScrollOverflowIndicator(SCROLL_OVERFLOW_INDICATOR_POSITION.MIDDLE);
      } else if (isTop) {
        setScrollOverflowIndicator(SCROLL_OVERFLOW_INDICATOR_POSITION.TOP);
      } else if (isBottom) {
        setScrollOverflowIndicator(SCROLL_OVERFLOW_INDICATOR_POSITION.BOTTOM);
      }
    }
  }, []);

  useEffect(() => {
    if (intersectedBody.visited) {
      updateScrollOverflowIndicator();
    }
  }, [intersectedBody.visited]);

  return (
    <ChakraModal
      isOpen={isOpen!}
      onClose={onClose!}
      variant={variant}
      {...props}
    >
      <ModalOverlay />
      <ModalContent
        minW={{ base: '100%', md: minWidth }}
        {...modalContentProps}
      >
        {showModalHeading && <ModalHeader>{HeadingComponent}</ModalHeader>}
        {showCloseButton && <ModalCloseButton />}
        <ModalBody
          ref={bodyRef}
          className="hide-scrollbar"
          onScroll={updateScrollOverflowIndicator}
        >
          {scrollBehavior === 'inside' && (
            <>
              {[SCROLL_OVERFLOW_INDICATOR_POSITION.BOTTOM, SCROLL_OVERFLOW_INDICATOR_POSITION.MIDDLE].includes(
                scrollOverflowIndicator
              ) && (
                <Box
                  position="absolute"
                  top="74px"
                  left={0}
                  width="full"
                  height="24px"
                  bg="linear-gradient(180deg, #0000000d, transparent)"
                  userSelect="none"
                  pointerEvents="none"
                />
              )}
              {[SCROLL_OVERFLOW_INDICATOR_POSITION.TOP, SCROLL_OVERFLOW_INDICATOR_POSITION.MIDDLE].includes(
                scrollOverflowIndicator
              ) &&
                showModalFooter && (
                  <Box
                    position="absolute"
                    bottom={`${(footerRef?.current?.scrollHeight || 0) + 42}px`}
                    left={0}
                    width="full"
                    height="24px"
                    bg="linear-gradient(0deg, #0000000d, transparent)"
                    userSelect="none"
                    pointerEvents="none"
                  />
                )}
            </>
          )}
          {children}
        </ModalBody>
        {showModalFooter && (
          <ModalFooter
            ref={footerRef}
            as={Flex}
            justifyContent="space-between"
            p="0"
            mt="22px"
          >
            {footerAlert}
            {showTertiaryButton && (
              <Button
                fontSize="md"
                lineHeight="1"
                isDisabled={!tertiaryButtonEnabled}
                variant={tertiaryButtonVariant}
                onClick={onTertiaryButtonClick}
                isLoading={isTertiaryButtonLoading}
              >
                {tertiaryButtonLabel}
              </Button>
            )}
            <Flex
              gap="28px"
              ml="auto"
            >
              {showSecondaryButton && (
                <Button
                  isDisabled={!secondaryButtonEnabled}
                  variant={secondaryButtonVariant}
                  onClick={onSecondaryButtonClick}
                >
                  {secondaryButtonLabel}
                </Button>
              )}
              {showPrimaryButton && (
                <Button
                  isDisabled={!primaryButtonEnabled}
                  variant={primaryButtonVariant}
                  onClick={onPrimaryButtonClick}
                  isLoading={isPrimaryButtonLoading}
                  colorScheme={primaryButtonColorScheme}
                >
                  {primaryButtonLabel}
                </Button>
              )}
            </Flex>
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
}

interface IModalContext {
  modalProps: IModal;
  modalDisclosure: UseDisclosureReturn | Record<any, any>;
  setModalProps: React.Dispatch<React.SetStateAction<IModal>>;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
const ModalContext = createContext<IModalContext>({
  modalProps: {},
  modalDisclosure: {},
  setModalProps: () => {},
});

export const useModalContext = () => useContext(ModalContext);

export const useModal = (): IModalContext => {
  const [modalProps, setModalProps] = useState<IModal>({});
  const modalDisclosure = useDisclosure();

  return { modalProps, modalDisclosure, setModalProps };
};

export function ModalProvider({ children, ...props }: PropsWithChildren<IModalContext>) {
  return <ModalContext.Provider value={props}>{children}</ModalContext.Provider>;
}
