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
  useToast,
} from '@chakra-ui/react';
import { FaCirclePlus, FaFeatherPointed, FaFloppyDisk, FaTrash } from 'react-icons/fa6';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';

import { ContentSection } from '@app/dashboard/components/PageComponents';
import { useProject, useThemeSettings } from '@lib/state';
import { projectRoute } from 'src/routes';
import {
  ThemeSettingsFontLink,
  ThemeSettingsScriptLink,
  ThemeSettingsStyleLink,
  UpdateThemeSettingsPayload,
} from '@lib/models/theme-settings';

type FormValues = {
  style_links: ThemeSettingsStyleLink[];
  script_links: ThemeSettingsScriptLink[];
  font_links: ThemeSettingsFontLink[];
};

function StyleScriptLinks() {
  const form = useFormContext();

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
      <Flex
        direction="column"
        gap="14px"
      >
        <Heading
          as="h5"
          display="flex"
          gap="8px"
          size="sm"
          mb="6px"
        >
          Theme Styles:
        </Heading>
        {styleLinksFieldArray.fields.length === 0 && (
          <Flex
            direction="column"
            align="center"
          >
            <Text fontSize="62px">🤷‍♂️</Text>
            <Text fontSize="14px">Not styles yet.</Text>
          </Flex>
        )}
        {styleLinksFieldArray.fields.map((item, index) => (
          <Flex
            key={item.id}
            gap="12px"
            align="flex-end"
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
      </Flex>
      <Flex justify="center">
        <Button
          variant="ghost"
          size="sm"
          mt="12px"
          leftIcon={<FaCirclePlus size={16} />}
          onClick={() => styleLinksFieldArray.append({ link: '', location: '', attributes: '' })}
        >
          Add Style
        </Button>
      </Flex>
      <Divider my="24px" />
      <Flex
        direction="column"
        gap="14px"
      >
        <Heading
          as="h5"
          display="flex"
          gap="8px"
          size="sm"
          mb="6px"
        >
          Theme Scripts:
        </Heading>
        {scriptLinksFieldArray.fields.length === 0 && (
          <Flex
            direction="column"
            align="center"
          >
            <Text fontSize="62px">🤷‍♂️</Text>
            <Text fontSize="14px">Not scripts yet.</Text>
          </Flex>
        )}
        {scriptLinksFieldArray.fields.map((item, index) => (
          <Flex
            key={item.id}
            gap="12px"
            align="flex-end"
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
            Add Script
          </Button>
        </Flex>
      </Flex>
      <Divider my="24px" />
      <Flex
        direction="column"
        gap="14px"
      >
        <Flex
          direction="column"
          gap="14px"
        >
          <Heading
            as="h5"
            display="flex"
            gap="8px"
            size="sm"
            mb="6px"
          >
            Theme Fonts:
          </Heading>
          {fontLinksFieldArray.fields.length === 0 && (
            <Flex
              direction="column"
              align="center"
            >
              <Text fontSize="62px">🤷‍♂️</Text>
              <Text fontSize="14px">Not styles yet.</Text>
            </Flex>
          )}
          {fontLinksFieldArray.fields.map((item, index) => (
            <Flex
              key={item.id}
              gap="12px"
              align="flex-end"
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
        </Flex>
        <Flex justify="center">
          <Button
            variant="ghost"
            size="sm"
            mt="12px"
            leftIcon={<FaCirclePlus size={16} />}
            onClick={() => fontLinksFieldArray.append({ name: '', link: '', location: '', attributes: '' })}
          >
            Add Font
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export function ThemeSettings() {
  const { projectId } = projectRoute.useParams();
  const { project } = useProject(projectId);
  const { themeSettings, updateThemeSettings } = useThemeSettings(projectId);

  const toast = useToast();

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
      })
    ),
    defaultValues: {
      style_links: themeSettings.style_links ? JSON.parse(themeSettings.style_links) : [],
      script_links: themeSettings.script_links ? JSON.parse(themeSettings.script_links) : [],
      font_links: themeSettings.font_links ? JSON.parse(themeSettings.font_links) : [],
    },
  });

  const handleFormSave = async (formValues: FormValues) => {
    try {
      const payload: UpdateThemeSettingsPayload = {
        custom_head_html: themeSettings.custom_head_html,
        // Form values
        style_links: JSON.stringify(formValues.style_links),
        script_links: JSON.stringify(formValues.script_links),
        font_links: JSON.stringify(formValues.font_links),
      };
      await updateThemeSettings({ id: project.theme_settings_id, payload });
      toast({
        title: 'Theme Settings saved successfully',
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
          <FaFeatherPointed />
          Theme Settings
        </Heading>
        <Button
          colorScheme="malachite"
          size="sm"
          leftIcon={<FaFloppyDisk size={18} />}
          onClick={form.handleSubmit(handleFormSave)}
          isLoading={form.formState.isSubmitting}
          isDisabled={!form.formState.isValid}
        >
          Save Theme Settings
        </Button>
      </Flex>
      <Alert
        fontSize="14px"
        status="info"
        borderRadius="12px"
        mb="24px"
        width="max-content"
      >
        <AlertIcon />
        You can use the following smarties for the url:&nbsp;
        <Code
          fontSize="12px"
          // eslint-disable-next-line react/no-children-prop
          children="{$wa_theme_url}"
        />
      </Alert>
      <ContentSection>
        <StyleScriptLinks />
      </ContentSection>
      {/* <ContentSection mt="24px">
        <FontLinks />
      </ContentSection> */}
    </FormProvider>
  );
}
