export enum ADD_TEMPLATE_STEPS {
  TEMPLATE_LOCATION = 1,
  BASIC_INFO = 2,
  REVIEW = 3,
  PROCESSING = 4,
}

export type ATFTemplateLocationPayload = {
  templateLocation: string;
};

export type ATFBasicInfoPayload = {
  name: string;
  status: boolean;
};

export type ATFStepperState = {
  [ADD_TEMPLATE_STEPS.TEMPLATE_LOCATION]?: ATFTemplateLocationPayload;
  [ADD_TEMPLATE_STEPS.BASIC_INFO]?: ATFBasicInfoPayload;
};
