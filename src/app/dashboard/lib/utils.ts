import { appPath } from '@lib/utils.tsx';

export const prepareTemplateImageUrl = (templateLocation: string, colorMode: string) => {
  let templateImageFileName = `${templateLocation}-${colorMode}.svg`;

  if (['header', 'footer', 'page'].find((item) => templateLocation.includes(item))) {
    templateImageFileName = `${templateLocation.split('_')[1]}-${colorMode}.svg`;
  }

  if (templateLocation.includes('error')) {
    templateImageFileName = `404-${colorMode}.svg`;
  }

  return appPath(`/img/templates/${templateImageFileName}`);
};
