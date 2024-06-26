import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Spinner,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Switch,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Tr,
  useColorMode,
  useColorModeValue,
  useTheme,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from 'axios';
import { FaArrowLeft, FaArrowRight, FaCircleCheck } from 'react-icons/fa6';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { Project } from '@lib/models/project';
import { SelectOptionProps } from '@ui/atomic/molecules/select/Select';
import { useTemplateList, useWebasystApplicationList } from '@lib/state';
import { useModalContext } from '@ui/atomic/organisms/modal';
import { useStepper } from '@lib/utils/utils';
import {
  ADD_TEMPLATE_STEPS,
  ATFBasicInfoPayload,
  ATFStepperState,
  ATFTemplateLocationPayload,
} from '@app/dashboard/template/components/add-project-template-flow/models';
import { TEMPLATE_LOCATION_NAME_MAP } from '@app/dashboard/lib/constants';
import { TEMPLATE_PROJECT_TEMPLATE_TYPES } from '@lib/models/template';
import { prepareTemplateImageUrl } from '@app/dashboard/lib/utils';

const stepList = [
  { title: i18next.t('Location'), description: i18next.t('Template Location') },
  { title: i18next.t('Info'), description: i18next.t('Basic template info') },
  { title: i18next.t('Review'), description: i18next.t('Create Template') },
];

function FromStepper({
  activeStep,
  steps,
}: {
  activeStep: number;
  steps: Array<{ title: string; description: string }>;
}) {
  const bgColor = useColorModeValue('grey.50', 'ebony.700');

  return (
    <Stepper
      index={activeStep - 1}
      padding="24px"
      borderRadius="2xl"
      bgColor={bgColor}
      position="sticky"
      top="8px"
    >
      {steps.map((step) => (
        <Step key={step.title}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink="0">
            <StepTitle as="p">{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}

function TemplateLocationStep({
  project,
  stepperState,
  onSubmit,
}: {
  project: Project;
  stepperState: ATFStepperState;
  onSubmit: Function;
}) {
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    stepperState[ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION]?.templateLocation
  );

  const theme = useTheme();
  const boxShadowColor = useColorModeValue(theme.colors.grey[50], theme.colors.ebony[900]);
  const borderColor = useColorModeValue(theme.colors.grey[100], theme.colors.ebony[800]);
  const mode = useColorMode();

  const { appList } = useWebasystApplicationList();
  const { t } = useTranslation();

  const templateLocationOptionList: SelectOptionProps[] = appList
    .find((app) => app.app_id === project.app_id)!
    .template_locations.map((templateLocation) => ({ label: templateLocation, value: templateLocation }));

  const handleTemplateLocationChange = (option: SelectOptionProps) => {
    setSelectedLocation(option.value as string);
  };

  const handleContinueButtonClick = () => {
    onSubmit({ templateLocation: selectedLocation });
  };

  return (
    <>
      <Heading
        as="h5"
        size="md"
        mt="52px"
        mb="8px"
      >
        {t('Select Template Location')}
      </Heading>
      <Text
        fontSize="sm"
        mb="32px"
      >
        {t(
          'Select the type of template you want to create. For example, if you want to create a header for your website, select a "Header" template type.'
        )}
      </Text>
      <Grid
        gridTemplateColumns="1fr 1fr 1fr"
        gap="24px"
        mt="32px"
      >
        {templateLocationOptionList.map((option) => (
          <GridItem
            key={option.value}
            onClick={() => handleTemplateLocationChange(option)}
            _hover={{ cursor: 'pointer' }}
            role="group"
          >
            <Flex
              justify="space-between"
              alignItems="center"
              height="28px"
              mb="8px"
              {...(selectedLocation === option.value ? { color: 'dodger.500' } : {})}
            >
              <Text
                fontSize="14px"
                fontWeight="600"
              >
                {TEMPLATE_LOCATION_NAME_MAP[option.value]}
              </Text>
              {selectedLocation === option.value && <FaCircleCheck size={18} />}
            </Flex>
            <Box width="full">
              <Image
                src={prepareTemplateImageUrl(option.value as string, mode.colorMode)}
                fallback={<Text>{t('Image Not Found')}!</Text>}
                borderRadius="lg"
                boxShadow={`0 0 12px 4px ${boxShadowColor}`}
                border="1px solid"
                _groupHover={{ borderColor: 'dodger.500' }}
                {...(selectedLocation === option.value ? { borderColor: 'dodger.500' } : { borderColor })}
              />
            </Box>
          </GridItem>
        ))}
      </Grid>
      <Flex
        justify="center"
        mt="32px"
        mx="auto"
        width="max-content"
        position="sticky"
        bottom="24px"
      >
        <Button
          variant={selectedLocation ? 'solid' : 'outline'}
          rightIcon={<FaArrowRight />}
          isDisabled={!selectedLocation}
          onClick={handleContinueButtonClick}
        >
          {t('Continue')}
        </Button>
      </Flex>
    </>
  );
}

function BasicInfoStep({
  project,
  stepperState,
  initialState,
  onSubmit,
  onPrevious,
}: {
  project: Project;
  stepperState: ATFStepperState;
  initialState?: ATFBasicInfoPayload;
  onSubmit: Function;
  onPrevious: Function;
}) {
  const theme = useTheme();
  const boxShadowColor = useColorModeValue(theme.colors.grey[50], theme.colors.ebony[900]);
  const mode = useColorMode();

  const { appList } = useWebasystApplicationList();
  const { t } = useTranslation();

  const templateLocationOptionList: SelectOptionProps[] = appList
    .find((app) => app.app_id === project.app_id)!
    .template_locations.map((templateLocation) => ({ label: templateLocation, value: templateLocation }));

  const selectedOption = templateLocationOptionList.find(
    (option) => option.value === stepperState[ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION]?.templateLocation
  )!;

  const form = useForm<ATFBasicInfoPayload>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1),
        status: z.boolean(),
      })
    ),
    mode: 'onChange',
    defaultValues: {
      name: initialState?.name ?? '',
      status: initialState?.status ?? false,
    },
  });

  const handleFromSubmit = async (formValues: ATFBasicInfoPayload) => {
    onSubmit(formValues);
  };

  return (
    <FormProvider {...form}>
      <Flex
        gap="42px"
        mt="52px"
      >
        <Box
          width="222px"
          flexShrink={0}
        >
          <Flex
            justify="space-between"
            alignItems="center"
            height="28px"
            mb="8px"
            color="dodger.500"
          >
            <Text
              fontSize="14px"
              fontWeight="600"
            >
              {TEMPLATE_LOCATION_NAME_MAP[selectedOption.value]}
            </Text>
            <FaCircleCheck size={18} />
          </Flex>
          <Box width="full">
            <Image
              src={prepareTemplateImageUrl(selectedOption.value as string, mode.colorMode)}
              fallback={<Text>{t('Image Not Found')}!</Text>}
              borderRadius="lg"
              boxShadow={`0 0 12px 4px ${boxShadowColor}`}
              border="1px solid"
              borderColor="dodger.500"
            />
          </Box>
        </Box>
        <Box>
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
            color="ebony.100"
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
                  placeholder="Site Header Template"
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
          <Flex
            justify="center"
            gap="24px"
            mt="32px"
            mx="auto"
            width="max-content"
            position="sticky"
            bottom="24px"
          >
            <Button
              variant="ghost"
              colorScheme="grey"
              leftIcon={<FaArrowLeft />}
              onClick={() => onPrevious()}
            >
              {t('Previous')}
            </Button>
            <Button
              variant={form.formState.isValid ? 'solid' : 'outline'}
              rightIcon={<FaArrowRight />}
              onClick={form.handleSubmit(handleFromSubmit)}
              isDisabled={!form.formState.isValid}
            >
              {t('Continue')}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </FormProvider>
  );
}

function ReviewStep({
  project,
  stepperState,
  onSubmit,
  onPrevious,
}: {
  project: Project;
  stepperState: ATFStepperState;
  onSubmit: Function;
  onPrevious: Function;
}) {
  const theme = useTheme();
  const boxShadowColor = useColorModeValue(theme.colors.grey[50], theme.colors.ebony[900]);
  const mode = useColorMode();

  const { appList } = useWebasystApplicationList();
  const { t } = useTranslation();

  const templateLocationOptionList: SelectOptionProps[] = appList
    .find((app) => app.app_id === project.app_id)!
    .template_locations.map((templateLocation) => ({ label: templateLocation, value: templateLocation }));

  const selectedOption = templateLocationOptionList.find(
    (option) => option.value === stepperState[ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION]?.templateLocation
  )!;
  return (
    <Flex
      gap="42px"
      mt="52px"
    >
      <Box
        width="222px"
        flexShrink={0}
      >
        <Flex
          justify="space-between"
          alignItems="center"
          height="28px"
          mb="8px"
          color="dodger.500"
        >
          <Text
            fontSize="14px"
            fontWeight="600"
          >
            {TEMPLATE_LOCATION_NAME_MAP[selectedOption.value]}
          </Text>
          <FaCircleCheck size={18} />
        </Flex>
        <Box width="full">
          <Image
            src={prepareTemplateImageUrl(selectedOption.value as string, mode.colorMode)}
            fallback={<Text>{t('Image Not Found')}!</Text>}
            borderRadius="lg"
            boxShadow={`0 0 12px 4px ${boxShadowColor}`}
            border="1px solid"
            borderColor="dodger.500"
          />
        </Box>
      </Box>
      <Box width="full">
        <Heading
          as="h5"
          size="md"
          mb="8px"
        >
          {t('Review')}
        </Heading>
        <Text
          fontSize="sm"
          mb="32px"
          color="ebony.100"
        >
          {t('Confirm the template information before creating')}.
        </Text>
        <TableContainer
          border="1px solid"
          borderColor="grey.200"
          _dark={{ borderColor: 'grey.700' }}
          borderRadius="lg"
        >
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>{t('Template Name')}</Td>
                <Td>{stepperState[ADD_TEMPLATE_STEPS.BASIC_INFO]?.name}</Td>
              </Tr>
              <Tr>
                <Td>{t('Status')}</Td>
                <Td>
                  <Tag colorScheme={stepperState[ADD_TEMPLATE_STEPS.BASIC_INFO]?.status ? 'malachite' : 'grey'}>
                    {stepperState[ADD_TEMPLATE_STEPS.BASIC_INFO]?.status ? t('Public') : t('Draft')}
                  </Tag>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex
          justify="center"
          gap="24px"
          mt="98px"
          mx="auto"
          width="max-content"
        >
          <Button
            variant="ghost"
            colorScheme="grey"
            leftIcon={<FaArrowLeft />}
            onClick={() => onPrevious()}
          >
            {t('Previous')}
          </Button>
          <Button
            variant="solid"
            onClick={() => onSubmit()}
          >
            {t('Create Template')}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

function ProcessingStep() {
  const { t } = useTranslation();
  return (
    <Flex
      direction="column"
      justify="center"
      alignItems="center"
      gap="32px"
      my="98px"
      mx="auto"
    >
      <Spinner size="lg" />
      <Heading>{t('One moment....')}</Heading>
    </Flex>
  );
}

export function CreateProjectTemplateFlow({ project }: { project: Project }) {
  const stepper = useStepper<ATFStepperState>(Object.keys(ADD_TEMPLATE_STEPS).length, {});
  const toast = useToast();

  const { modalDisclosure } = useModalContext();

  const { createTemplate } = useTemplateList(project.id);
  const { t } = useTranslation();
  const createTemplateHandler = async () => {
    stepper.setStep(ADD_TEMPLATE_STEPS.PROCESSING);

    try {
      await createTemplate({
        name: stepper.stepperState[ADD_TEMPLATE_STEPS.BASIC_INFO]?.name!,
        wtp_status: stepper.stepperState[ADD_TEMPLATE_STEPS.BASIC_INFO]?.status ? '1' : '0',
        wtp_template_location: stepper.stepperState[ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION]?.templateLocation!,
        wtp_template_type: TEMPLATE_PROJECT_TEMPLATE_TYPES.DEFAULT,
        wtp_project_id: project.id,
      });

      modalDisclosure.onClose();

      toast({
        title: t('Template created successfully'),
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

  // Submit handlers
  const templateLocationStepSubmitHandler = useCallback(
    (payload: ATFTemplateLocationPayload) => {
      stepper.updateState((prevState) => ({
        ...prevState,
        [ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION]: payload,
      }));
      stepper.goToNextStep();
    },
    [stepper]
  );

  const basicInfoStepSubmitHandler = useCallback(
    async (payload: ATFBasicInfoPayload) => {
      await stepper.updateState((prevState) => ({
        ...prevState,
        [ADD_TEMPLATE_STEPS.BASIC_INFO]: payload,
      }));
      stepper.setStep(ADD_TEMPLATE_STEPS.REVIEW);
    },
    [stepper]
  );

  return (
    <Box p="44px">
      {stepper.currentStep < ADD_TEMPLATE_STEPS.PROCESSING && (
        <FromStepper
          activeStep={stepper.currentStep}
          steps={stepList}
        />
      )}
      {stepper.currentStep === ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION && (
        <TemplateLocationStep
          project={project}
          stepperState={stepper.stepperState}
          onSubmit={templateLocationStepSubmitHandler}
        />
      )}
      {stepper.currentStep === ADD_TEMPLATE_STEPS.BASIC_INFO && (
        <BasicInfoStep
          project={project}
          stepperState={stepper.stepperState}
          initialState={stepper.stepperState[ADD_TEMPLATE_STEPS.BASIC_INFO]}
          onSubmit={basicInfoStepSubmitHandler}
          onPrevious={stepper.goToPrevStep}
        />
      )}
      {stepper.currentStep === ADD_TEMPLATE_STEPS.REVIEW && (
        <ReviewStep
          project={project}
          stepperState={stepper.stepperState}
          onSubmit={createTemplateHandler}
          onPrevious={stepper.goToPrevStep}
        />
      )}
      {stepper.currentStep === ADD_TEMPLATE_STEPS.PROCESSING && <ProcessingStep />}
    </Box>
  );
}
