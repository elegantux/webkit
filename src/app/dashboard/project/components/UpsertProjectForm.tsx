import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  ListItem,
  RadioProps,
  Switch,
  Text,
  Tooltip,
  UnorderedList,
  useRadio,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { CreateProjectPayload, PROJECT_APP_IDS, Project, UpdateProjectPayload } from '@lib/models/project';
import { Select, SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { useProjectList, useWebasystApplicationList, useWebasystSettings } from '@lib/state';
import { WebasystApp } from '@lib/models/cross-app';
import { useModalContext } from '@ui/atomic/organisms/modal';
import { APP_THEME_PREFIX } from '@lib/constants';
import { projectRoute } from '../../../../routes';
import { api } from '@lib/api.ts';

type SettlementValues = {
  domain?: SelectOptionProps;
  private?: boolean;
};

type FormValues = Pick<Project, 'name' | 'app_id' | 'theme_id'> & SettlementValues;

const appListToOptions = (appList: WebasystApp[]): SelectOptionProps[] => {
  return appList.map((app) => ({
    label: (
      <Flex
        align="center"
        gap="8px"
        textTransform="capitalize"
      >
        <Image
          src={app.icon}
          alt={app.app_id}
          width="18px"
          flexShrink={0}
        />
        {app.app_id}
      </Flex>
    ),
    value: app.app_id,
    payload: app,
  }));
};

function RadioCard(props: PropsWithChildren<RadioProps & { label: string; imageUrl: string }>) {
  const { label, imageUrl, isChecked, isDisabled } = props;

  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input
        {...input}
        disabled={isDisabled}
      />
      <Box
        {...checkbox}
        position="relative"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        transition="background 0.2s ease"
        _checked={{
          borderColor: isChecked ? 'dodger.500' : 'dodger.300',
        }}
        _hover={{
          borderColor: isChecked ? 'dodger.500' : 'dodger.300',
        }}
        _disabled={{
          opacity: 0.2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        px={5}
        py={3}
      >
        <Checkbox
          position="absolute"
          top="6px"
          left="6px"
          colorScheme="dodger"
          size="lg"
          pointerEvents="none"
          isChecked={isChecked}
          isDisabled={isDisabled}
        />
        <Image
          src={imageUrl}
          alt={label}
          width="120px"
          flexShrink={0}
          mx="auto"
        />
      </Box>
    </Box>
  );
}

function DomainSelector() {
  const [options, setOptions] = useState<SelectOptionProps[]>([]);
  const { t } = useTranslation();
  const form = useFormContext<FormValues>();
  const value = form.watch('domain');

  const onChange = (option: SelectOptionProps[] | any) => {
    form.setValue('domain', option);
  };

  const fetchDomains = async () => {
    const { data: domains } = await api.crossApp.getDomains();

    const result: SelectOptionProps[] = domains.map((domain) => ({
      label: domain.name,
      value: domain.id,
      payload: domain,
    }));

    setOptions(result);
    if (result[0]) {
      form.setValue('domain', result[0]);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <FormControl mt="24px">
      <FormLabel
        htmlFor="status"
        fontSize="sm"
        fontWeight="400"
      >
        {t('Select Domain')}*
      </FormLabel>
      <Select
        menuPosition="fixed"
        menuPlacement="bottom"
        value={value}
        options={options}
        onChange={onChange}
      />
    </FormControl>
  );
}

export function UpsertProjectForm({ project }: { project?: Project }) {
  const [shouldCreateSettlement, setShouldCreateSettlement] = useState(!project);
  const { setModalProps, modalDisclosure } = useModalContext();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();

  const { appList, refetch: refetchWebasystApplicationList } = useWebasystApplicationList();
  const { settings: webasystSettings } = useWebasystSettings();
  const { createProject, updateProject, isMutating } = useProjectList();

  const form = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1),
        app_id: z.string().min(1),
        theme_id: z.custom((v) => {
          const value = v as string;

          if (!value) {
            return false;
          }

          const cleanValue = `${APP_THEME_PREFIX}${value.trim()}`;

          if (value.trim().length < 3) {
            return false;
          }

          // Underscore only allowed in the middle of the string
          const regex = /^[a-z]([a-z1-9]*(_[a-z1-9]+)*)?$/;
          if (!regex.test(value)) {
            return false;
          }

          return !appList.find((app) => app.theme_id_list.includes(cleanValue));
        }, t('Theme name invalid or already exists')),
        domain: z.any().optional(),
        private: z.boolean().optional(),
      })
    ),
    mode: 'onChange',
    defaultValues: {
      name: project?.name ?? '',
      app_id: project?.app_id,
      theme_id: project?.theme_id ?? '',
      private: true,
    },
  });

  const appSelectOptions = appListToOptions(appList);

  const onAppRadioButtonChange = (value: string) => {
    if (!project) {
      form.setValue('app_id', value as PROJECT_APP_IDS);
      form.trigger('app_id');
    }
  };

  const { getRadioProps } = useRadioGroup({
    name: 'app_id',
    defaultValue: form.getValues('app_id'),
    onChange: onAppRadioButtonChange,
  });

  const onSubmit = async (formValues: FormValues) => {
    const payload: CreateProjectPayload | UpdateProjectPayload = {
      name: formValues.name,
      app_id: formValues.app_id,
      theme_id: formValues.theme_id,
    };

    let createdProject;
    try {
      if (project) {
        await updateProject({ id: project.id, payload });
      } else {
        createdProject = await createProject(payload);

        // Create a settlement for the project
        if (shouldCreateSettlement) {
          await api.site.createSettlement({
            app: createdProject.data.app_id,
            name: createdProject.data.name,
            theme: createdProject.data.theme_id,
            url: `${createdProject.data.theme_id}/*`,
            locale: webasystSettings.locale === 'ru' ? 'ru_RU' : 'en_US',
            private: !!formValues.private,
            domain_id: formValues.domain?.payload.id,
          });
        }
      }

      await refetchWebasystApplicationList();

      modalDisclosure.onClose();

      if (createdProject) {
        await navigate({ to: projectRoute.to, params: { projectId: createdProject.data.id } });
      }

      toast({
        title: t('Project saved successfully'),
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

  useEffect(() => {
    setModalProps((prevState) => ({
      ...prevState,
      primaryButtonEnabled: form.formState.isValid,
      isPrimaryButtonLoading: isMutating,
      onPrimaryButtonClick: form.handleSubmit(onSubmit),
    }));
  }, [form.formState.isValid, form.handleSubmit, isMutating, shouldCreateSettlement]);

  return (
    <FormProvider {...form}>
      <FormControl
        mt={6}
        mb={8}
        isDisabled={!!project}
        opacity={project ? 0.5 : 1}
      >
        <FormLabel
          fontSize="sm"
          mb={4}
        >
          {t('Select an application for the project')}:
        </FormLabel>
        <Grid
          gridTemplateColumns={`repeat(${appSelectOptions.length}, 1fr)`}
          gap="32px"
          {...(project
            ? {
                userSelect: 'none',
                pointerEvents: 'none',
              }
            : {})}
        >
          {appSelectOptions.map((app) => (
            <RadioCard
              key={app.value}
              label={app.payload.app_id}
              imageUrl={app.payload.icon}
              isDisabled={app.value === PROJECT_APP_IDS.SHOP}
              {...getRadioProps({ value: app.value })}
            />
          ))}
        </Grid>
      </FormControl>
      <Divider />
      <Flex gap="24px">
        <FormControl isInvalid={!!form.formState.errors.name}>
          <FormLabel fontSize="sm">{t('Name of the project')}*</FormLabel>
          <Input
            placeholder="Blog - News"
            {...form.register('name')}
          />
          <FormErrorMessage>{t('This field is required')}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={!!form.formState.errors.theme_id}
          isDisabled={!!project}
          opacity={project ? 0.5 : 1}
        >
          <FormLabel fontSize="sm">{t('Name of new theme')}*</FormLabel>
          <InputGroup>
            {!project && <InputLeftAddon px="8px">webkit_</InputLeftAddon>}
            <Input
              placeholder="blog"
              {...form.register('theme_id')}
            />
            <InputRightAddon>
              <Tooltip
                placement="bottom"
                label={
                  <UnorderedList mb={0}>
                    <ListItem>{t('Allowed to use letters (a-z) and digits (1-9)')}</ListItem>
                    <ListItem>{t('Must start with a-z')}</ListItem>
                    <ListItem>{t('Must end with a-z or 1-9')}</ListItem>
                    <ListItem>{t('Allowed to use underscore(_) in the middle of the string')}</ListItem>
                  </UnorderedList>
                }
                borderRadius="4px"
                fontSize="xs"
                p="8px 8px 8px 14px"
                hasArrow
              >
                <Text>
                  <FaInfoCircle size={18} />
                </Text>
              </Tooltip>
            </InputRightAddon>
          </InputGroup>
          <FormErrorMessage>{form.formState.errors.theme_id?.message}</FormErrorMessage>
        </FormControl>
      </Flex>
      {!project && (
        <FormControl mt="24px">
          <Flex justify="space-between">
            <FormLabel
              htmlFor="create_settlement"
              fontSize="sm"
              fontWeight="400"
            >
              {t('Create a settlement for this project')}?
            </FormLabel>
            <Switch
              id="create_settlement"
              isChecked={shouldCreateSettlement}
              onChange={() => setShouldCreateSettlement((prevState) => !prevState)}
            />
          </Flex>
        </FormControl>
      )}
      {shouldCreateSettlement && (
        <FormControl>
          <Flex justify="space-between">
            <FormLabel
              htmlFor="private"
              fontSize="sm"
              fontWeight="400"
            >
              {t('Make this settlement private until the project is completed')}?
            </FormLabel>
            <Switch
              id="private"
              {...form.register('private')}
            />
          </Flex>
        </FormControl>
      )}
      {shouldCreateSettlement && <DomainSelector />}
    </FormProvider>
  );
}
