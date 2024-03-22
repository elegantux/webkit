import { useSuspenseQuery } from '@tanstack/react-query';

import { Template } from '@lib/models/template';
import { Response } from '@lib/models/response';
import { api } from '@app/editor/lib/api';
import { PluginDependencies } from '@lib/models/plugin';
import { TemplateSnippetListResponse } from '@lib/models/snippet';

// Constants
export const STATE_TYPES = {
  PLUGINS_DEPENDENCIES: 'plugins_dependencies',
  TEMPLATE_SNIPPET_LIST: 'template_snippet_list',
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

export const useTemplateSnippetList = () => {
  const getTemplateSnippets = () => api.editor.getTemplateSnippets();
  const { data } = useSuspenseQuery<Response<TemplateSnippetListResponse[]>>({
    queryKey: [STATE_TYPES.TEMPLATE_SNIPPET_LIST],
    queryFn: getTemplateSnippets,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    snippetList: data?.data ?? [],
  };
};
