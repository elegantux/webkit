import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spacer,
  Spinner,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { ChangeEvent, Suspense, memo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  FaAngleLeft,
  FaCirclePlus,
  FaDownload,
  FaFloppyDisk,
  FaMagnifyingGlass,
  FaMobileButton,
  FaTabletButton,
  FaTv,
  FaVectorSquare,
  FaXmark,
} from 'react-icons/fa6';
import { AxiosError } from 'axios';

import { EDITOR_STORE, useBlockListDisclosure, useEditorStore } from '@app/editor/lib/store';
import { editorRoute } from '../../../routes';
import { useTemplate } from '@lib/state';
import { useTemplateSnippetList } from '@app/editor/lib/state';
import { Modal, ModalProvider, useModal, useModalContext } from '@ui/atomic/organisms/modal';
import { TemplateSnippet, TemplateSnippetListResponse } from '@lib/models/snippet';
import { appPath } from '@lib/utils.tsx';

import WebkitIcon from '@assets/icons/webkit.svg?react';

export const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE_PORTRAIT: 'mobilePortrait',
  MOBILE_LANDSCAPE: 'mobileLandscape',
};

export const DEVICE_TYPE_NAME = {
  [DEVICE_TYPE.DESKTOP]: 'Desktop',
  [DEVICE_TYPE.TABLET]: 'Tablet',
  [DEVICE_TYPE.MOBILE_PORTRAIT]: 'Mobile Portrait',
  [DEVICE_TYPE.MOBILE_LANDSCAPE]: 'Mobile Landscape',
};

export const DEVICE_TYPE_ICON = {
  [DEVICE_TYPE.DESKTOP]: <FaTv size={16} />,
  [DEVICE_TYPE.TABLET]: <FaTabletButton size={16} />,
  [DEVICE_TYPE.MOBILE_LANDSCAPE]: <FaMobileButton size={16} />,
  [DEVICE_TYPE.MOBILE_PORTRAIT]: <FaMobileButton size={16} />,
};

function extractTypesFromJson(json: any): string[] {
  const types = new Set<string>(); // Use a Set to ensure uniqueness

  function traverse(node: any) {
    if (Array.isArray(node)) {
      // If the current node is an array, iterate over each element
      node.forEach((element) => traverse(element));
    } else if (typeof node === 'object' && node !== null) {
      // If the current node is an object, check for the 'type' property
      if (node.type) {
        types.add(node.type); // Add the type to the Set if it exists
      }
      // Recurse into each property of the object
      Object.values(node).forEach((value) => traverse(value));
    }
  }

  traverse(json); // Start the traversal from the root

  return Array.from(types); // Convert the Set to an Array and return it
}

function TemplateSnippetCard({ snippet }: { snippet: TemplateSnippet }) {
  const editor = useEditorStore((state) => state.editor);
  const templateModal = useModalContext();

  const bgColor = useColorModeValue('grey.100', 'ebony.600');
  const bgHoverColor = useColorModeValue('grey.200', 'ebony.400');

  const handleInsertTemplateSnippet = () => {
    const selectedComponent = editor.getSelected();
    // console.log('selectedComponent', selectedComponent);

    if (selectedComponent) {
      selectedComponent.append(snippet.front_content);
    } else {
      editor.addComponents(snippet.front_content);
    }
    // editor.addComponents(`<style>${snippet.front_styles}</style>${snippet.front_content}`);

    templateModal.modalDisclosure.onClose();
  };

  return (
    <Flex
      as="figure"
      role="group"
      position="relative"
      bgColor={bgColor}
      flexDirection="column"
      borderRadius="8px"
      cursor="pointer"
      transition="background-color 0.2s ease-in-out"
      overflow="hidden"
      boxShadow="lg"
      _hover={{ bgColor: bgHoverColor }}
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
        src={snippet.cover_url}
        alt={snippet.title}
        fallbackSrc={appPath('/img/webkit.svg')}
        width="100%"
        height="240px"
        maxW="95%"
        mx="auto"
        objectFit="scale-down"
        borderRadius="2px"
      />
      <Spacer />
      <Flex
        gap="12px"
        justify="space-between"
        py="8px"
        px="14px"
        bgColor="white"
        _dark={{ bgColor: 'black' }}
      >
        <Flex direction="column">
          <Text
            fontSize="sm"
            fontWeight="bold"
            mt="4px"
          >
            {snippet.title}
          </Text>
          <Text
            fontSize="xs"
            mt="4px"
          >
            {snippet.description}
          </Text>
        </Flex>
        <IconButton
          aria-label="Insert Template"
          colorScheme="malachite"
          icon={<FaDownload />}
          onClick={handleInsertTemplateSnippet}
        />
      </Flex>
    </Flex>
  );
}

function TemplateSnippetList({ templateSnippetList }: { templateSnippetList: TemplateSnippetListResponse }) {
  const [snippetList, setSnippetList] = useState<TemplateSnippet[]>(templateSnippetList.snippet_list);
  const [searchText, setSearchText] = useState<string>('');

  const updateSnippetList = (value: string) => {
    let filteredList: TemplateSnippet[] = templateSnippetList.snippet_list;

    // Filter by search text
    if (value.length > 0) {
      filteredList = templateSnippetList.snippet_list.filter((snippet) =>
        snippet.title.toLowerCase().includes(value.toLowerCase())
      );
    }

    setSnippetList(filteredList);

    setSearchText(value);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateSnippetList(value.trim());
  };

  const handleClearInput = () => {
    setSearchText('');
    updateSnippetList('');
  };

  return (
    <Box>
      <FormControl
        width="320px"
        mb="24px"
        ml="auto"
      >
        <InputGroup>
          <InputLeftAddon pointerEvents="none">
            <FaMagnifyingGlass color="gray.300" />
          </InputLeftAddon>
          <Input
            value={searchText}
            placeholder="button"
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
      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        gap="24px"
      >
        {snippetList.map((snippet) => (
          <GridItem
            key={templateSnippetList.id + snippet.title}
            width="full"
          >
            <TemplateSnippetCard snippet={snippet} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}

function TemplatesModalContent() {
  const { snippetList } = useTemplateSnippetList();

  return (
    <Tabs
      position="relative"
      variant="unstyled"
      defaultIndex={1}
    >
      <TabList
        borderBottom="1px solid"
        borderColor="grey.100"
        overflowX="auto"
        _dark={{ borderColor: 'ebony.500' }}
      >
        <Tab
          as="span"
          opacity={0.2}
          flexShrink={0}
          boxShadow="none"
          color="inherit"
          _hover={{ boxShadow: 'none', color: 'inherit' }}
          _disabled={{ color: 'inherit' }}
          isDisabled
        >
          <Text
            fontSize="16px"
            fontWeight="bold"
          >
            My Snippets
          </Text>
        </Tab>
        {snippetList.map((item) => (
          <Tab
            key={item.id}
            display="flex"
            alignItems="center"
            gap="14px"
            flexShrink={0}
            boxShadow="none"
            color="inherit"
            _hover={{ boxShadow: 'none', color: 'inherit' }}
          >
            <Image
              alt={item.name}
              src={`/${item.img}`}
              width="24px"
              fallback={
                <Image
                  src={appPath('/img/webkit.svg')}
                  filter="grayscale(100%)"
                  opacity="0.2"
                  width="24px"
                />
              }
            />
            <Text
              fontSize="16px"
              fontWeight="bold"
            >
              {item.name}
            </Text>
          </Tab>
        ))}
      </TabList>
      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="blue.500"
        borderRadius="1px"
      />
      <TabPanels mt="32px">
        <TabPanel>
          <p>Coming soon! ⏳🙏</p>
        </TabPanel>
        {snippetList.map((item) => (
          <TabPanel
            key={item.id}
            p={0}
          >
            <TemplateSnippetList templateSnippetList={item} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

const SaveProject = memo(() => {
  const toast = useToast();

  const { templateId } = editorRoute.useParams();
  const { template, updateTemplate } = useTemplate(Number(templateId));
  console.log('SaveProject - template', template);

  const editor = useEditorStore((state) => state.editor);

  const handleSave = async () => {
    const { assets, pages, styles } = editor.getProjectData();
    // Temp save
    // localStorage.setItem('gjsProject', JSON.stringify(editor.getProjectData()));

    const mainComponent = editor.getWrapper();

    // Keep smarty arrows {$wa->}
    const html = mainComponent?.getInnerHTML().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const css = editor.getCss({ component: mainComponent });
    const js = editor.getJs({ component: mainComponent });
    console.log({
      html,
      css,
      js,
    });

    const projectComponentTypes = extractTypesFromJson(pages).filter((type: string) => type.includes('_'));

    try {
      // Save
      await updateTemplate({
        templateId: template.id,
        payload: {
          name: template.name,
          wtp_id: template.wtp_id,
          wtp_status: template.wtp_status,
          //
          editor_assets: JSON.stringify(assets),
          editor_components: JSON.stringify(pages),
          editor_styles: JSON.stringify(styles),
          //
          front_content: html,
          front_styles: css ?? '',
          front_scripts: js,
          //
          component_types: projectComponentTypes.join(','),
        },
      });
      toast({
        title: 'Project saved successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
    }
  };

  return (
    <Button
      colorScheme="malachite"
      size="sm"
      onClick={handleSave}
      leftIcon={<FaFloppyDisk size={20} />}
    >
      Save
    </Button>
  );
});

function ResponsiveButtons() {
  const editor = useEditorStore(EDITOR_STORE.EDITOR);
  const commands = editor.Commands;

  const [selectedDevice, setSelectedDevice] = useState<string>(DEVICE_TYPE.DESKTOP);
  const [swVisibility, setSwVisibility] = useState(false);

  const handleDeviceButtonClick = (device: string) => {
    editor.setDevice(device);
    setSelectedDevice(device);
  };

  const toggleComponentsBorderHandler = () => {
    const isBordersVisible = commands.isActive('sw-visibility');
    if (isBordersVisible) {
      commands.stop('sw-visibility');
    } else {
      editor.runCommand('sw-visibility');
    }

    setSwVisibility(commands.isActive('sw-visibility'));
  };

  return (
    <Flex>
      {Object.values(DEVICE_TYPE).map((device) => (
        <Tooltip
          key={device}
          placement="bottom"
          borderRadius="4px"
          label={DEVICE_TYPE_NAME[device]}
          hasArrow
        >
          <IconButton
            variant="ghost"
            size="sm"
            colorScheme={selectedDevice === device ? 'dodger' : 'grey'}
            aria-label={DEVICE_TYPE_NAME[device]}
            icon={DEVICE_TYPE_ICON[device]}
            {...(device === DEVICE_TYPE.MOBILE_LANDSCAPE ? { transform: 'rotate(90deg)' } : {})}
            onClick={() => handleDeviceButtonClick(device)}
          />
        </Tooltip>
      ))}
      <Tooltip
        placement="bottom"
        borderRadius="4px"
        label="Toggle components visibility"
        hasArrow
      >
        <IconButton
          variant="ghost"
          size="sm"
          colorScheme={swVisibility ? 'dodger' : 'grey'}
          aria-label="Toggle components visibility"
          icon={<FaVectorSquare size={16} />}
          onClick={() => toggleComponentsBorderHandler()}
        />
      </Tooltip>
    </Flex>
  );
}

export function Navbar() {
  const templatesModal = useModal();
  const navigate = useNavigate();
  const openBlockListSidebar = useBlockListDisclosure((state) => state.onOpen);

  return (
    <Flex
      bg="var(--background-color)"
      alignItems="center"
      px="16px"
      height="100%"
      justify="space-between"
      borderTop="2px solid"
      borderBottom="2px solid"
      borderColor="var(--chakra-colors-chakra-border-color)"
    >
      <Flex gap="24px">
        <Button
          colorScheme="dodger"
          variant="link"
          size="sm"
          leftIcon={<FaAngleLeft />}
          _hover={{ textDecoration: 'none' }}
          onClick={() => navigate({ to: '/app/dashboard/project-list' })}
        >
          Back
        </Button>
        <Button
          colorScheme="dodger"
          size="sm"
          leftIcon={<FaCirclePlus size={20} />}
          iconSpacing="6px"
          onClick={openBlockListSidebar}
        >
          Add Block
        </Button>
      </Flex>
      <Flex gap="24px">
        <Button
          colorScheme="grey"
          variant="ghost"
          size="sm"
          onClick={templatesModal.modalDisclosure.onOpen}
          leftIcon={<FaMagnifyingGlass size={16} />}
        >
          Templates
        </Button>
        <ResponsiveButtons />
      </Flex>
      <SaveProject />
      <ModalProvider {...templatesModal}>
        <Modal
          scrollBehavior="inside"
          title="Template Library"
          showModalFooter={false}
          modalContentProps={{
            width: '100vw',
            maxW: '1120px',
            top: '5vh',
          }}
          {...templatesModal.modalProps}
          {...templatesModal.modalDisclosure}
        >
          <Suspense
            fallback={
              <Flex
                justify="center"
                my="62px"
              >
                <Spinner />
              </Flex>
            }
          >
            <TemplatesModalContent />
          </Suspense>
        </Modal>
      </ModalProvider>
    </Flex>
  );
}
