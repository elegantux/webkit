import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  RadioProps,
  useRadio,
  useRadioGroup,
  useToast,
} from '@chakra-ui/react';
import { PropsWithChildren, useEffect } from 'react';
import { AxiosError } from 'axios';

import { CreateProjectPayload, Project, UpdateProjectPayload } from '@lib/models/project';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { useProjectList, useWebasystApplicationList } from '@lib/state';
import { WebasystApp } from '@lib/models/cross-app';
import { useModalContext } from '@ui/atomic/organisms/modal';
import { APP_THEME_PREFIX } from '@lib/constants';

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
  const { label, imageUrl, isChecked } = props;

  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        transition="background 0.2s ease"
        _checked={{
          bg: 'dodger.300',
          // color: 'white',
          borderColor: 'grey.600',
          _dark: { bg: 'dodger.700' },
        }}
        _hover={{
          bg: isChecked ? 'dodger.300' : 'dodger.50',
          _dark: { bg: isChecked ? 'dodger.700' : 'dodger.900' },
        }}
        px={5}
        py={3}
      >
        <Image
          src={imageUrl}
          alt={label}
          width="120px"
          flexShrink={0}
        />
      </Box>
    </Box>
  );
}

export function UpsertProjectForm({ project }: { project?: Project }) {
  const { setModalProps, modalDisclosure } = useModalContext();
  const toast = useToast();

  const { appList, refetch: refetchWebasystApplicationList } = useWebasystApplicationList();
  const { createProject, isMutating } = useProjectList();

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

          return !appList.find((app) => app.theme_id_list.includes(cleanValue));
        }, 'Theme name invalid or already exists'),
      })
    ),
    mode: 'onChange',
    // defaultValues: getInitialFormData(allergy),
  });

  const appSelectOptions = appListToOptions(appList);

  const onAppRadioButtonChange = (value: string) => {
    form.setValue('app_id', value);
    form.trigger('app_id');
  };

  const { getRadioProps } = useRadioGroup({
    name: 'app_id',
    // defaultValue: 'react',
    onChange: onAppRadioButtonChange,
  });

  const onSubmit = async (formValues: FormValues) => {
    console.log('onSubmit', formValues);

    const payload: CreateProjectPayload | UpdateProjectPayload = {
      name: formValues.name,
      app_id: formValues.app_id,
      theme_id: formValues.theme_id,
    };

    try {
      if (project) {
      } else {
        await createProject(payload);
        refetchWebasystApplicationList();
      }
      toast({
        title: 'Project saved successfully',
        status: 'success',
        duration: 3000,
      });
      modalDisclosure.onClose();
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
      <Box
        mt={6}
        mb={8}
      >
        <FormLabel mb={4}>Select an application for the project:</FormLabel>
        <Flex
          justify="space-between"
          gap="32px"
        >
          {appSelectOptions.map((app) => (
            <RadioCard
              key={app.value}
              label={app.payload.app_id}
              imageUrl={app.payload.icon}
              {...getRadioProps({ value: app.value })}
            />
          ))}
        </Flex>
      </Box>
      <FormControl isInvalid={!!form.formState.errors.name}>
        <FormLabel fontSize="sm">Name of the project*</FormLabel>
        <Input
          placeholder="Blog - News"
          {...form.register('name')}
        />
        <FormErrorMessage>This field is required</FormErrorMessage>
      </FormControl>
      <FormControl
        mt="24px"
        isInvalid={!!form.formState.errors.theme_id}
      >
        <FormLabel fontSize="sm">Name of new theme*</FormLabel>
        <InputGroup>
          <InputLeftAddon>webkit-</InputLeftAddon>
          <Input
            placeholder="blog"
            {...form.register('theme_id')}
          />
        </InputGroup>
        <FormErrorMessage>{form.formState.errors.theme_id?.message}</FormErrorMessage>
      </FormControl>
    </FormProvider>
  );
}
