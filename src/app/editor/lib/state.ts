import { useSuspenseQuery } from '@tanstack/react-query';

import { Template } from '@lib/models/template';
import { Response } from '@lib/models/response';
import { api } from '@app/editor/lib/api';
import { PluginDependencies } from '@lib/models/plugin';

// Constants
export const STATE_TYPES = {
  PLUGINS_DEPENDENCIES: 'plugins_dependencies',
};

export const usePluginsDependencies = (templateId: Template['id']) => {
  const getPluginDependencies = () => api.editor.getPluginDependencies(templateId);
  const { data } = useSuspenseQuery<Response<PluginDependencies>>({
    queryKey: [STATE_TYPES.PLUGINS_DEPENDENCIES],
    queryFn: getPluginDependencies,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    pluginsDependencies: data?.data,
  };
};
