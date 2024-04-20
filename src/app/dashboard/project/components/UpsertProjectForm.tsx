import { FormProvider, useForm } from 'react-hook-form';
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
  Text,
  Tooltip,
  UnorderedList,
  useRadio,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react';
import { PropsWithChildren, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { CreateProjectPayload, PROJECT_APP_IDS, Project, UpdateProjectPayload } from '@lib/models/project';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { useProjectList, useWebasystApplicationList } from '@lib/state';
import { WebasystApp } from '@lib/models/cross-app';
import { useModalContext } from '@ui/atomic/organisms/modal';
import { APP_THEME_PREFIX } from '@lib/constants';
import { projectRoute } from '../../../../routes';

type FormValues = Pick<Project, 'name' | 'app_id' | 'theme_id'>;

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

export function UpsertProjectForm({ project }: { project?: Project }) {
  const { setModalProps, modalDisclosure } = useModalContext();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();

  const { appList, refetch: refetchWebasystApplicationList } = useWebasystApplicationList();
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
      })
    ),
    mode: 'onChange',
    defaultValues: {
      name: project?.name ?? '',
      app_id: project?.app_id,
      theme_id: project?.theme_id ?? '',
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
  }, [form.formState.isValid, form.handleSubmit, isMutating]);

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
      <FormControl isInvalid={!!form.formState.errors.name}>
        <FormLabel fontSize="sm">{t('Name of the project')}*</FormLabel>
        <Input
          placeholder="Blog - News"
          {...form.register('name')}
        />
        <FormErrorMessage>{t('This field is required')}</FormErrorMessage>
      </FormControl>
      <FormControl
        mt="24px"
        isInvalid={!!form.formState.errors.theme_id}
        isDisabled={!!project}
        opacity={project ? 0.5 : 1}
      >
        <FormLabel fontSize="sm">{t('Name of new theme')}*</FormLabel>
        <InputGroup>
          {!project && <InputLeftAddon>webkit_</InputLeftAddon>}
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
    </FormProvider>
  );
}
