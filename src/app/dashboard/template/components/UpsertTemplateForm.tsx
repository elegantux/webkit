import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { TEMPLATE_PROJECT_TEMPLATE_TYPES, Template, UpdateTemplatePayload } from '@lib/models/template';
import { useModalContext } from '@ui/atomic/organisms/modal';
import { useTemplateList } from '@lib/state';
import { Project } from '@lib/models/project';
import { getInfoToastObject } from '@lib/utils';

type FormValues = Pick<UpdateTemplatePayload, 'name'> & {
  status: boolean;
};

export function UpsertTemplateForm({
  template,
  templateType = TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT,
  templateLocation = null,
  project,
}: {
  template?: Template;
  templateType?: TEMPLATE_PROJECT_TEMPLATE_TYPES;
  templateLocation?: string | null;
  project: Project;
}) {
  const toast = useToast();
  const { setModalProps, modalDisclosure } = useModalContext();

  const { createTemplate, updateTemplate, isLoading } = useTemplateList(project.id);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1).max(120),
        status: z.boolean(),
      })
    ),
    mode: 'onChange',
    defaultValues: {
      name: template?.name ?? '',
      status: template?.wtp_status === '0' ? false : true ?? false,
    },
  });

  const onSubmit = async (formValues: FormValues) => {
    try {
      if (template) {
        await updateTemplate({
          templateId: template.id,
          payload: {
            name: formValues.name,
            wtp_id: template.wtp_id,
            wtp_status: formValues.status ? '1' : '0',
          },
        });
        toast({
          title: t('Template updated successfully'),
          status: 'success',
          duration: 3000,
        });
      } else {
        await createTemplate({
          name: formValues.name!,
          wtp_status: formValues.status ? '1' : '0',
          wtp_template_location: templateLocation,
          wtp_template_type: templateType,
          wtp_project_id: project.id,
        });
        toast({
          title: t('Template created successfully'),
          status: 'success',
          duration: 3000,
        });
      }
      modalDisclosure.onClose();
    } catch (error: AxiosError | any) {
      const responseErrorMessage = error?.response?.data?.errors?.message ?? 'Something went wrong!';
      toast({
        title: responseErrorMessage,
        status: 'error',
      });
      toast(getInfoToastObject());
    }
  };

  useEffect(() => {
    setModalProps((prevState) => ({
      ...prevState,
      primaryButtonEnabled: form.formState.isValid,
      isPrimaryButtonLoading: isLoading,
      onPrimaryButtonClick: form.handleSubmit(onSubmit),
    }));
  }, [form.formState.isValid, form.handleSubmit, isLoading]);

  return (
    <FormProvider {...form}>
      <Heading
        as="h5"
        size="md"
        mt="52px"
        mb="8px"
      >
        {t('Basic Info')}
      </Heading>
      <Text
        fontSize="sm"
        mb="32px"
      >
        {t(
          'The "Template Name" field is an indicator that allows you to differentiate between templates created for the same location'
        )}
        .
      </Text>
      <Grid
        gridTemplateColumns="1fr"
        gap="32px"
      >
        <GridItem>
          <FormControl isInvalid={!!form.formState.errors.name}>
            <FormLabel fontSize="sm">{t('Template Name')}*</FormLabel>
            <Input
              placeholder="Template for ..."
              {...form.register('name')}
            />
            <FormErrorMessage>{t('This field is required')}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel fontSize="sm">{t('Enable template')}?</FormLabel>
            <Flex justify="space-between">
              <FormLabel
                htmlFor="status"
                fontSize="sm"
                fontWeight="400"
              >
                {t('Display the template on the website')}?
              </FormLabel>
              <Switch
                id="status"
                {...form.register('status')}
              />
            </Flex>
          </FormControl>
        </GridItem>
      </Grid>
    </FormProvider>
  );
}
