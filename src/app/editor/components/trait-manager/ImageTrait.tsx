import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
  useTheme,
  useToast,
} from '@chakra-ui/react';
import { Trait } from 'grapesjs';
import { ChangeEvent, Suspense, useEffect, useState } from 'react';
import { create } from 'zustand';
import { FaMagnifyingGlass, FaTrash, FaUpload, FaXmark } from 'react-icons/fa6';
import { useDropzone } from 'react-dropzone';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { Modal, useModal } from '@ui/atomic/organisms/modal';
import { EDITOR_STORE, useEditorStore } from '@app/editor/lib/store';
import { PropertyHeader } from '@app/editor/components/style-manager/components/PropertyHeader';
import { useImageAssetList } from '@lib/state';
import { ImageAsset } from '@lib/models/asset';
import { appPath, getInfoToastObject } from '@lib/utils';
import { useTraitProperty } from '@app/editor/components/trait-manager/lib/utils';

import WebkitIcon from '@assets/icons/webkit.svg?react';

const useImageTraitStore = create<{
  image: ImageAsset | undefined;
  setActiveImage: (image: ImageAsset | undefined) => void;
}>((set) => ({
  image: undefined,
  setActiveImage: (image: ImageAsset | undefined) => set((state) => ({ ...state, image })),
}));

function ImageCard({ image }: { image: ImageAsset }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const { image: activeImage, setActiveImage } = useImageTraitStore();
  const { deleteImage } = useImageAssetList();

  const bgColor = useColorModeValue('grey.100', 'ebony.600');
  const bgHoverColor = useColorModeValue('grey.200', 'ebony.400');

  const handleIconClick = () => {
    if (isLoading) {
      return;
    }

    setActiveImage(image);
  };

  const handleImageDelete = async () => {
    try {
      setIsLoading(true);

      await deleteImage(image.id);
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';

      toast({
        title: responseErrorMessage,
        status: 'error',
      });
      toast(getInfoToastObject());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      as="figure"
      role="group"
      key={image.id}
      position="relative"
      bgColor={bgColor}
      flexDirection="column"
      p="8px"
      width="calc(25% - 18px)"
      height="auto"
      borderRadius="8px"
      cursor="pointer"
      transition="background-color 0.2s ease-in-out"
      border="2px solid transparent"
      borderColor={activeImage?.id === image?.id ? 'dodger.500' : 'transparent'}
      _hover={{ bgColor: bgHoverColor }}
      onClick={() => handleIconClick()}
    >
      <Image
        loading="lazy"
        fallback={
          <Flex
            justify="center"
            align="center"
            filter="grayscale(100%)"
            opacity="0.2"
          >
            <WebkitIcon />
          </Flex>
        }
        src={image.full_path}
        alt={image.original_filename}
        fallbackSrc={appPath('/img/webkit.svg')}
        width="100%"
        height="100%"
        maxH="150px"
        objectFit="contain"
        borderRadius="6px"
      />
      <Spacer />
      <Text
        fontSize="xs"
        mt="4px"
      >
        {image.original_filename}
      </Text>
      <IconButton
        aria-label="Delete Image"
        colorScheme="grey"
        position="absolute"
        top="8px"
        right="8px"
        p="4px"
        size="sm"
        opacity={0}
        icon={<FaTrash />}
        _groupHover={{ opacity: 1 }}
        _hover={{ top: '8px' }}
        _active={{ top: '8px' }}
        onClick={handleImageDelete}
      />
      {isLoading && (
        <Flex
          justify="center"
          alignItems="center"
          position="absolute"
          inset={0}
          m="auto"
          fontSize="62px"
          width="full"
          height="full"
          opacity={0.8}
          bgColor={bgColor}
        >
          <Spinner />
        </Flex>
      )}
    </Flex>
  );
}

function UploadFileButton({ buttonText = 'Upload up to 5 Images' }: { buttonText?: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const { addImage } = useImageAssetList();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/gif': [],
    },
    maxFiles: 5,
    maxSize: 1e7, // 1e7 bytes = 10 mb; 1e6 bytes = 1 mb
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return;
      }

      try {
        setIsLoading(true);

        const callbackList = acceptedFiles.map((file) => addImage(file));
        await Promise.all(callbackList);
      } catch (error: AxiosError | any) {
        const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';

        toast({
          title: responseErrorMessage,
          status: 'error',
        });
        toast(getInfoToastObject());
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Flex
      direction="column"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Button
        leftIcon={<FaUpload size={18} />}
        mr="0"
        isLoading={isLoading}
      >
        {buttonText}
      </Button>
      <Text
        as="em"
        fontSize="11px"
        mt="4px"
      >
        Max. file size 10MB: *.jpeg, *.png, *.gif
      </Text>
    </Flex>
  );
}

function ImageList() {
  const { imageList } = useImageAssetList();

  const [filteredImageList, setFilteredImageList] = useState<ImageAsset[]>(imageList);
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();

  const updateImageList = (value: string) => {
    let filteredList: ImageAsset[] = imageList;

    // Filter by search text
    if (value.length > 0) {
      filteredList = imageList.filter((image) => image.original_filename.includes(value));
    }

    if (value.length > 0) {
      setFilteredImageList(filteredList);
    } else {
      setFilteredImageList(imageList);
    }

    setSearchText(value);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateImageList(value.trim());
  };

  const handleClearInput = () => {
    setSearchText('');
    updateImageList('');
  };

  useEffect(() => {
    if (filteredImageList.length !== imageList.length) {
      setFilteredImageList(imageList);
      setSearchText('');
    }
  }, [imageList]);

  return (
    <Box mt="12px">
      <Flex
        justify="space-between"
        mb="24px"
      >
        <FormControl width="320px">
          <InputGroup>
            <InputLeftAddon pointerEvents="none">
              <FaMagnifyingGlass color="gray.300" />
            </InputLeftAddon>
            <Input
              value={searchText}
              placeholder="logo"
              onChange={handleSearchInputChange}
              autoFocus
            />
            {searchText.length > 0 && (
              <InputRightElement
                onClick={handleClearInput}
                cursor="pointer"
              >
                <FaXmark />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
        <UploadFileButton buttonText={t('Upload Images')} />
      </Flex>
      {imageList.length === 0 && (
        <Flex
          py="142px"
          justify="center"
          direction="column"
          alignItems="center"
          gap="24px"
        >
          <Heading
            size="lg"
            as="p"
          >
            {t('Start uploading images')}
          </Heading>
          <UploadFileButton buttonText={t('Upload')} />
        </Flex>
      )}
      {filteredImageList.length === 0 && imageList.length > 0 ? (
        <Flex
          py="142px"
          justify="center"
        >
          <Heading
            size="lg"
            as="p"
          >
            {t('Image not found')}: &quot;{searchText}&quot;
          </Heading>
        </Flex>
      ) : (
        <Flex
          flexWrap="wrap"
          gap="24px"
        >
          {filteredImageList.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}

function ImageTraitContent({ trait }: { trait: Trait }) {
  const { value, setValue, updateTraitValue, clearTraitValue, traitLabel } = useTraitProperty<string | undefined>(
    trait,
    ''
  );

  const theme = useTheme();
  const modal = useModal();
  const activeImage = useImageTraitStore((store) => store.image);
  const setActiveImage = useImageTraitStore((store) => store.setActiveImage);

  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const { t } = useTranslation();

  const hasValue = !!value;

  const bgImageColor = useColorModeValue(theme.colors.grey[300], theme.colors.ebony[400]);
  const bgColor = useColorModeValue('grey.100', 'ebony.500');
  const bgImage = `linear-gradient(45deg,${bgImageColor} 25%,transparent 0,transparent 75%,${bgImageColor} 0,${bgImageColor}),linear-gradient(45deg,${bgImageColor} 25%,transparent 0,transparent 75%,${bgImageColor} 0,${bgImageColor})`;

  const handleModalClose = () => {
    setActiveImage(undefined);
    modal.modalDisclosure.onClose();
  };

  const handlePrimaryButtonClick = () => {
    updateTraitValue(activeImage?.full_path);
    setValue(activeImage?.full_path);

    setActiveImage(undefined);
    modal.modalDisclosure.onClose();
  };

  const handleClearButton = () => {
    clearTraitValue();
    setActiveImage(undefined);
  };

  const updateTrait = () => {
    setValue(trait.getValue());
  };

  useEffect(() => {
    updateTrait();
    editor.on('undo', updateTrait);
    editor.on('redo', updateTrait);

    return () => {
      editor.off('undo', updateTrait);
      editor.off('redo', updateTrait);
    };
  }, [trait]);

  return (
    <Box key={trait.getId()}>
      <PropertyHeader
        onClear={handleClearButton}
        propertyLabel={traitLabel}
        hasValue={hasValue}
      />
      <Box
        position="relative"
        width="full"
        height="120px"
        bgImage={bgImage}
        bgSize="12px 12px"
        bgPosition="0 0,calc(12px / 2) calc(12px / 2)"
        bgColor={bgColor}
        border="1px solid"
        borderColor={bgImageColor}
        borderRadius="4px"
        overflow="hidden"
        role="group"
        cursor="pointer"
        onClick={modal.modalDisclosure.onOpen}
      >
        {hasValue && (
          <Box
            position="absolute"
            inset={0}
            m="auto"
            width="full"
            height="full"
          >
            <Image
              width="max-content"
              height="100%"
              objectFit="contain"
              mx="auto"
              src={value}
            />
          </Box>
        )}
        <Button
          position="absolute"
          width="full"
          top="unset"
          bottom="0px"
          opacity={0}
          transform="translateY(24px)"
          borderRadius={0}
          transition="transform 0.3s ease, opacity 0.3s ease"
          _groupHover={{
            transform: 'translateY(0px)',
            opacity: 1,
          }}
          _hover={{ top: 'unset' }}
          _active={{ top: 'unset' }}
        >
          {t('Select Image')}
        </Button>
      </Box>
      <Modal
        title={t('Select Image')}
        scrollBehavior="inside"
        isCentered
        minWidth="800px"
        primaryButtonLabel={t('Insert')}
        onPrimaryButtonClick={handlePrimaryButtonClick}
        primaryButtonEnabled={!!activeImage}
        showSecondaryButton={false}
        {...modal.modalProps}
        {...modal.modalDisclosure}
        onClose={handleModalClose}
      >
        <Suspense fallback={<Spinner />}>
          <ImageList />
        </Suspense>
      </Modal>
    </Box>
  );
}

// Data loader
export function ImageTrait({ trait }: { trait: Trait }) {
  return <ImageTraitContent trait={trait} />;
}
