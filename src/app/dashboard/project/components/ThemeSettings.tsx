import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
  useTheme,
  useToast,
} from '@chakra-ui/react';
import { FaBrush, FaCirclePlus, FaCss3Alt, FaFloppyDisk, FaFont, FaJs, FaTrash } from 'react-icons/fa6';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ContentSection } from '@app/dashboard/components/PageComponents';
import { useProject, useThemeSettings } from '@lib/state';
import { projectRoute } from 'src/routes';
import {
  ThemeSettingsFontLink,
  ThemeSettings as ThemeSettingsInterface,
  ThemeSettingsScriptLink,
  ThemeSettingsStyleLink,
  UpdateThemeSettingsPayload,
} from '@lib/models/theme-settings';
import { CodeEditor } from '@ui/atomic/organisms';
import { CODE_EDITOR_LANGUAGES } from '@ui/atomic/organisms/CodeEditor';

type FormValues = {
  style_links: ThemeSettingsStyleLink[];
  script_links: ThemeSettingsScriptLink[];
  font_links: ThemeSettingsFontLink[];
  custom_head_styles: ThemeSettingsInterface['custom_head_styles'];
};

function ButtonSwitch({
  value,
  leftLabel,
  rightLabel,
  onChange,
}: {
  value: boolean;
  leftLabel: string;
  rightLabel: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <Flex
      padding="4px"
      borderRadius="8px"
      bgColor="grey.50"
      _dark={{
        bgColor: 'ebony.600',
      }}
    >
      <Button
        variant={value ? 'solid' : 'ghost'}
        colorScheme="grey"
        size="xs"
        borderRadius="6px"
        onClick={() => onChange(true)}
      >
        {leftLabel}
      </Button>
      <Button
        variant={value ? 'ghost' : 'solid'}
        colorScheme="grey"
        size="xs"
        borderRadius="6px"
        onClick={() => onChange(false)}
      >
        {rightLabel}
      </Button>
    </Flex>
  );
}

function CustomHeadStylesEditor() {
  const form = useFormContext();
  const value = form.watch('custom_head_styles');

  const onChange = (v: string | undefined) => {
    form.setValue('custom_head_styles', v);
    form.trigger('custom_head_styles');
  };

  return (
    <Box
      overflow="hidden"
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.200"
      _dark={{
        borderColor: 'ebony.600',
      }}
    >
      <CodeEditor
        value={value}
        language={CODE_EDITOR_LANGUAGES.CSS}
        onChange={onChange}
      />
    </Box>
  );
}

function StyleScriptLinks() {
  const form = useFormContext();
  const [isStyleLinksTab, setIsStyleLinksTab] = useState(true);

  const theme = useTheme();
  const { t } = useTranslation();

  const styleLinksFieldArray = useFieldArray({
    control: form.control,
    name: 'style_links',
  });

  const scriptLinksFieldArray = useFieldArray({
    control: form.control,
    name: 'script_links',
  });

  const fontLinksFieldArray = useFieldArray({
    control: form.control,
    name: 'font_links',
  });

  return (
    <>
      <ContentSection>
        <Flex
          align="center"
          justify="space-between"
          mb="16px"
        >
          <Flex gap="6px">
            <FaCss3Alt
              size={20}
              color={theme.colors.dodger[500]}
            />
            <Heading
              as="h5"
              size="sm"
              mb="0px"
            >
              {t('Styles')}
            </Heading>
          </Flex>
          <ButtonSwitch
            value={isStyleLinksTab}
            leftLabel="Links"
            rightLabel="Css"
            onChange={setIsStyleLinksTab}
          />
        </Flex>
        {isStyleLinksTab ? (
          <>
            {styleLinksFieldArray.fields.length === 0 && (
              <Flex
                direction="column"
                align="center"
              >
                <Text fontSize="62px">🤷‍♂️</Text>
                <Text fontSize="14px">{t('No styles yet')}.</Text>
              </Flex>
            )}
            {styleLinksFieldArray.fields.map((item, index) => (
              <Flex
                key={item.id}
                gap="12px"
                align="flex-end"
                mb="8px"
              >
                <Input
                  flex={1}
                  placeholder="e.g. https://bootstrap.com/style.css"
                  {...form.register(`style_links.${index}.link`)}
                />
                <IconButton
                  aria-label="remove"
                  variant="ghost"
                  colorScheme="grey"
                  icon={<FaTrash size={16} />}
                  onClick={() => styleLinksFieldArray.remove(index)}
                />
              </Flex>
            ))}
            <Flex justify="center">
              <Button
                variant="ghost"
                size="sm"
                mt="12px"
                leftIcon={<FaCirclePlus size={16} />}
                onClick={() => styleLinksFieldArray.append({ link: '', location: '', attributes: '' })}
              >
                {t('Add Style Link')}
              </Button>
            </Flex>
          </>
        ) : (
          <CustomHeadStylesEditor />
        )}
      </ContentSection>
      <Divider
        width="10%"
        my="14px"
        mx="auto"
      />
      <ContentSection>
        <Flex
          align="center"
          justify="space-between"
          mb="16px"
        >
          <Flex gap="8px">
            <FaJs
              size={18}
              color={theme.colors.yellow[500]}
            />
            <Heading
              as="h5"
              size="sm"
              mb="0px"
            >
              {t('Scripts')}
            </Heading>
          </Flex>
        </Flex>
        {scriptLinksFieldArray.fields.length === 0 && (
          <Flex
            direction="column"
            align="center"
          >
            <Text fontSize="62px">🤷‍♂️</Text>
            <Text fontSize="14px">{t('No scripts yet')}.</Text>
          </Flex>
        )}
        {scriptLinksFieldArray.fields.map((item, index) => (
          <Flex
            key={item.id}
            gap="12px"
            align="flex-end"
            mb="8px"
          >
            <Input
              flex={1}
              placeholder="e.g. https://bootstrap.com/script.js"
              {...form.register(`script_links.${index}.link`)}
            />
            <IconButton
              aria-label="remove"
              variant="ghost"
              colorScheme="grey"
              icon={<FaTrash size={16} />}
              onClick={() => scriptLinksFieldArray.remove(index)}
            />
          </Flex>
        ))}
        <Flex justify="center">
          <Button
            variant="ghost"
            size="sm"
            mt="12px"
            leftIcon={<FaCirclePlus size={16} />}
            onClick={() => scriptLinksFieldArray.append({ link: '', location: '', attributes: '' })}
          >
            {t('Add Script Link')}
          </Button>
        </Flex>
      </ContentSection>
      <Divider
        width="10%"
        my="14px"
        mx="auto"
      />
      <ContentSection>
        <Flex
          align="center"
          justify="space-between"
          mb="16px"
        >
          <Flex gap="8px">
            <FaFont size={18} />
            <Heading
              as="h5"
              size="sm"
              mb="0px"
            >
              {t('Fonts')}
            </Heading>
          </Flex>
        </Flex>
        {fontLinksFieldArray.fields.length === 0 && (
          <Flex
            direction="column"
            align="center"
          >
            <Text fontSize="62px">🤷‍♂️</Text>
            <Text fontSize="14px">{t('No fonts yet')}.</Text>
          </Flex>
        )}
        {fontLinksFieldArray.fields.map((item, index) => (
          <Flex
            key={item.id}
            gap="12px"
            align="flex-end"
            mb="8px"
          >
            <Flex
              flex={1}
              gap="12px"
            >
              <Box width="200px">
                <FormLabel fontSize="14px">Font Family Name</FormLabel>
                <Input
                  width="full"
                  placeholder="Open Sans"
                  {...form.register(`font_links.${index}.name`)}
                />
              </Box>
              <Box flex={1}>
                <FormLabel fontSize="14px">Font Link</FormLabel>
                <Input
                  width="full"
                  placeholder="e.g. https://bootstrap.com/font.css"
                  {...form.register(`font_links.${index}.link`)}
                />
              </Box>
            </Flex>
            <IconButton
              aria-label="remove"
              variant="ghost"
              colorScheme="grey"
              icon={<FaTrash size={16} />}
              onClick={() => fontLinksFieldArray.remove(index)}
            />
          </Flex>
        ))}
        <Flex justify="center">
          <Button
            variant="ghost"
            size="sm"
            mt="12px"
            leftIcon={<FaCirclePlus size={16} />}
            onClick={() => fontLinksFieldArray.append({ name: '', link: '', location: '', attributes: '' })}
          >
            {t('Add Font Link')}
          </Button>
        </Flex>
      </ContentSection>
    </>
  );
}

export function ThemeSettings() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId);
  const { themeSettings, updateThemeSettings } = useThemeSettings(projectId);

  const toast = useToast();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        style_links: z.array(
          z.object({ link: z.string().min(1), location: z.string().optional(), attributes: z.string().optional() })
        ),
        script_links: z.array(
          z.object({ link: z.string().min(1), location: z.string().optional(), attributes: z.string().optional() })
        ),
        font_links: z.array(
          z.object({
            name: z.string().min(1),
            link: z.string().min(1),
            location: z.string().optional(),
            attributes: z.string().optional(),
          })
        ),
        custom_head_styles: z.string().optional(),
      })
    ),
    defaultValues: {
      style_links: themeSettings.style_links ? JSON.parse(themeSettings.style_links) : [],
      script_links: themeSettings.script_links ? JSON.parse(themeSettings.script_links) : [],
      font_links: themeSettings.font_links ? JSON.parse(themeSettings.font_links) : [],
      custom_head_styles: themeSettings?.custom_head_styles ?? '',
    },
  });

  const handleFormSave = async (formValues: FormValues) => {
    try {
      const payload: UpdateThemeSettingsPayload = {
        // Form values
        style_links: JSON.stringify(formValues.style_links),
        script_links: JSON.stringify(formValues.script_links),
        font_links: JSON.stringify(formValues.font_links),
        custom_head_styles: formValues.custom_head_styles,
      };
      await updateThemeSettings({ id: project.theme_settings_id, payload });
      toast({
        title: t('Theme Settings saved successfully'),
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
    <FormProvider {...form}>
      <Flex
        mb="24px"
        justify="space-between"
      >
        <Heading
          as="h4"
          display="flex"
          gap="12px"
          size="md"
        >
          <FaBrush />
          {t('Theme Settings')}
        </Heading>
        <Button
          colorScheme="malachite"
          size="sm"
          leftIcon={<FaFloppyDisk size={18} />}
          onClick={form.handleSubmit(handleFormSave)}
          isLoading={form.formState.isSubmitting}
          isDisabled={!form.formState.isValid}
        >
          {t('Save Settings')}
        </Button>
      </Flex>
      <Alert
        fontSize="14px"
        status="info"
        borderRadius="12px"
        mb="24px"
        width="full"
        wordBreak="break-word"
        flexWrap="wrap"
        gap="4px"
      >
        <AlertIcon mr="4px" />
        {t('You can use the following smarties for the url')}:&nbsp;
        <Code
          fontSize="12px"
          // eslint-disable-next-line react/no-children-prop
          children="{$wa_theme_url}, {$wa_webkit_app_url}"
        />
      </Alert>
      <StyleScriptLinks />
    </FormProvider>
  );
}
