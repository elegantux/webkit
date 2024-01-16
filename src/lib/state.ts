import { useSuspenseQuery } from '@tanstack/react-query';

import { Template } from '@lib/models/template';
import { Response } from '@lib/models/response';
import { api } from '@lib/api';

// Constants
export const STATE_TYPES = {
  TEMPLATE: 'template',
};

export const useTemplate = (templateId: Template['id']) => {
  const getTemplate = () => api.template.getTemplate(templateId);
  const { data } = useSuspenseQuery<Response<Template>>({
    queryKey: [STATE_TYPES.TEMPLATE],
    queryFn: getTemplate,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    template: data?.data,
  };
};
