import {
  Alert,
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
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCircleInfo, FaDownload, FaLock, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { useTemplateSnippetList } from '@app/editor/lib/state';
import { appPath } from '@lib/utils';
import { TEMPLATE_SNIPPET_TYPES, TemplateSnippet, TemplateSnippetListResponse } from '@lib/models/snippet';
import { useEditorStore } from '@app/editor/lib/store';
import { Modal, useModal, useModalContext } from '@ui/atomic/organisms/modal';
import { CodeEditor } from '@ui/atomic/molecules';
import { useTemplate, useThemeSettings } from '@lib/state.ts';
import { editorRoute } from '../../../routes';
import { ThemeSettingsScriptLink, ThemeSettingsStyleLink } from '@lib/models/theme-settings';

import WebkitIcon from '@assets/icons/webkit.svg?react';

const TEMPLATE_SNIPPET_TYPE_NAME_MAP = {
  [TEMPLATE_SNIPPET_TYPES.ELEMENT]: 'Elements',
  [TEMPLATE_SNIPPET_TYPES.COMPONENT]: 'Components',
  [TEMPLATE_SNIPPET_TYPES.PAGE]: 'Pages',
};

function TemplateSnippetCard({ snippet }: { snippet: TemplateSnippet }) {
  const editor = useEditorStore((state) => state.editor);
  const { templateId } = editorRoute.useParams();
  const { template } = useTemplate(Number(templateId));
  const { themeSettings } = useThemeSettings(template.wtp_project_id);

  const templateModal = useModalContext();
  const confirmationModal = useModal();

  const bgColor = useColorModeValue('grey.100', 'ebony.600');
  const bgHoverColor = useColorModeValue('grey.200', 'ebony.400');

  const hasDependencies = snippet.style_links || snippet.script_links || snippet.font_links;

  const themeSettingsDependencies = useMemo(() => {
    return {
      style_links: themeSettings.style_links
        ? JSON.parse(themeSettings.style_links).map((item: ThemeSettingsStyleLink) => item.link)
        : [],
      script_links: themeSettings.script_links
        ? JSON.parse(themeSettings.script_links).map((item: ThemeSettingsScriptLink) => item.link)
        : [],
      font_links: themeSettings.font_links
        ? JSON.parse(themeSettings.font_links).map((item: ThemeSettingsScriptLink) => item.link)
        : [],
    };
  }, [themeSettings]);

  const insertTemplateSnippet = () => {
    const selectedComponent = editor.getSelected();

    if (selectedComponent && selectedComponent.get('type') === 'basic_container') {
      selectedComponent.append(snippet.front_content);
    } else {
      editor.addComponents(snippet.front_content);
    }
    // editor.addComponents(`<style>${snippet.front_styles}</style>${snippet.front_content}`);

    templateModal.modalDisclosure.onClose();
  };

  const handleInsertTemplateSnippet = () => {
    if (hasDependencies) {
      if (
        (snippet.style_links &&
          !snippet.style_links.find((item) => themeSettingsDependencies.style_links.includes(item.link))) ||
        (snippet.script_links &&
          !snippet.script_links.find((item) => themeSettingsDependencies.script_links.includes(item.link))) ||
        (snippet.font_links &&
          !snippet.font_links.find((item) => themeSettingsDependencies.font_links.includes(item.link)))
      ) {
        confirmationModal.modalDisclosure.onOpen();
      } else {
        insertTemplateSnippet();
      }
    } else {
      insertTemplateSnippet();
    }
  };

  return (
    <>
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
      {hasDependencies && (
        <Modal
          title="Insert Template"
          primaryButtonLabel="Confirm"
          scrollBehavior="inside"
          isCentered
          onSecondaryButtonClick={confirmationModal.modalDisclosure.onClose}
          {...confirmationModal.modalProps}
          {...confirmationModal.modalDisclosure}
        >
          {/* <Text mb="14px"> */}
          {/*  This {snippet.type} has the following dependencies. When you confirm this modal, all dependencies will be */}
          {/*  added to the project&apos;s theme settings. */}
          {/* </Text> */}
          <Text mb="14px">
            This {snippet.type} has the following dependencies. You will have to add them manually in the theme
            settings.
          </Text>
          <Alert
            status="error"
            mb="32px"
          >
            <FaCircleInfo style={{ flexShrink: 0 }} />
            {/* <Text */}
            {/*  ml="12px" */}
            {/*  fontSize="14px" */}
            {/* > */}
            {/*  These dependencies will not be removed along with the deleted template. Therefore, you will have to remove */}
            {/*  them manually from the theme settings. */}
            {/* </Text> */}
            <Text
              ml="12px"
              fontSize="14px"
            >
              This {snippet.type} may not look or work correctly without its dependencies.
            </Text>
          </Alert>

          {snippet.style_links && (
            <Flex
              direction="column"
              gap="12px"
              mb="24px"
            >
              <Text>Styles:</Text>
              <CodeEditor
                value={JSON.stringify(snippet.style_links, null, 4)}
                codeEditor={null}
                setCodeEditor={() => {}}
                onChange={() => {}}
                height="220px"
                readOnly
              />
            </Flex>
          )}
          {snippet.script_links && (
            <Flex
              direction="column"
              gap="12px"
              mb="24px"
            >
              <Text>Scripts:</Text>
              <CodeEditor
                value={JSON.stringify(snippet.script_links, null, 4)}
                codeEditor={null}
                setCodeEditor={() => {}}
                onChange={() => {}}
                height="220px"
                readOnly
              />
            </Flex>
          )}
          {snippet.font_links && (
            <Flex
              direction="column"
              gap="12px"
              mb="24px"
            >
              <Text>Fonts:</Text>
              <CodeEditor
                value={JSON.stringify(snippet.font_links, null, 4)}
                codeEditor={null}
                setCodeEditor={() => {}}
                onChange={() => {}}
                height="220px"
                readOnly
              />
            </Flex>
          )}
        </Modal>
      )}
    </>
  );
}

function TemplateSnippetList({ templateSnippetList }: { templateSnippetList: TemplateSnippetListResponse }) {
  const [snippetList, setSnippetList] = useState<TemplateSnippet[]>(templateSnippetList.snippet_list);
  const [searchText, setSearchText] = useState<string>('');
  const [templateType, setTemplateType] = useState<TEMPLATE_SNIPPET_TYPES>(TEMPLATE_SNIPPET_TYPES.ELEMENT);

  const snippetTypesCounter = useMemo(() => {
    return {
      [TEMPLATE_SNIPPET_TYPES.ELEMENT]: templateSnippetList.snippet_list.filter(
        (item) => item.type === TEMPLATE_SNIPPET_TYPES.ELEMENT
      ).length,
      [TEMPLATE_SNIPPET_TYPES.COMPONENT]: templateSnippetList.snippet_list.filter(
        (item) => item.type === TEMPLATE_SNIPPET_TYPES.COMPONENT
      ).length,
      [TEMPLATE_SNIPPET_TYPES.PAGE]: templateSnippetList.snippet_list.filter(
        (item) => item.type === TEMPLATE_SNIPPET_TYPES.PAGE
      ).length,
    };
  }, [templateSnippetList]);

  const updateSnippetList = (value: string, type: TEMPLATE_SNIPPET_TYPES) => {
    let filteredList: TemplateSnippet[] = templateSnippetList.snippet_list.filter((snippet) => snippet.type === type);

    // Filter by search text
    if (value.length > 0) {
      filteredList = filteredList.filter((snippet) => snippet.title.toLowerCase().includes(value.toLowerCase()));
    }

    setSnippetList(filteredList);

    setSearchText(value);
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateSnippetList(value.trim(), templateType);
  };

  const handleTemplateTypeChange = (type: TEMPLATE_SNIPPET_TYPES) => {
    setTemplateType(type);
    updateSnippetList(searchText, type);
  };

  const handleClearInput = () => {
    setSearchText('');
    updateSnippetList('', templateType);
  };

  // Do initial filtering
  useEffect(() => {
    updateSnippetList('', templateType);
  }, []);

  return (
    <Box pb="24px">
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
        <Flex gap="4px">
          {Object.values(TEMPLATE_SNIPPET_TYPES).map((type) => (
            <Button
              key={type}
              variant={templateType === type ? 'outline' : 'ghost'}
              colorScheme={templateType === type ? 'dodger' : 'grey'}
              borderTop={0}
              borderLeft={0}
              borderRight={0}
              borderRadius="12px 12px 0 0"
              onClick={() => handleTemplateTypeChange(type)}
            >
              {TEMPLATE_SNIPPET_TYPE_NAME_MAP[type]} ({snippetTypesCounter[type]})
            </Button>
          ))}
        </Flex>
      </Flex>
      {snippetList.length === 0 && (
        <Flex
          justify="center"
          py="62px"
        >
          <Text>{TEMPLATE_SNIPPET_TYPE_NAME_MAP[templateType]} not found!</Text>
        </Flex>
      )}
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

export function TemplateLibrary() {
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
          <FaLock size={14} />
          <Text
            fontSize="16px"
            fontWeight="bold"
            ml="14px"
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
              {item.name} ({item.snippet_list.length})
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
