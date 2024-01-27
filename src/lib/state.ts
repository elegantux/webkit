import { useMutation, useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { Template } from '@lib/models/template';
import { PaginatedResponse, Response, SearchParams } from '@lib/models/response';
import { api } from '@lib/api';
import { CreateProjectPayload, Project } from '@lib/models/project';
import { getNextPageParam } from '@lib/utils/state-utils';
import { WebasystApp } from '@lib/models/cross-app';

// Constants
export const STATE_TYPES = {
  TEMPLATE: 'template',
  TEMPLATE_LIST: 'template_list',
  PROJECT_LIST: 'project_list',
  WEBASYST_APP_LIST: 'webasyst_app_list',
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
    template: data.data,
  };
};

export const useTemplateList = (projectId: Project['id'], filters: SearchParams = {}) => {
  const getTemplateList = () => api.template.getTemplateList(projectId, filters);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery<
    PaginatedResponse<Template[]>
  >({
    queryKey: [STATE_TYPES.TEMPLATE_LIST, projectId],
    queryFn: getTemplateList,
    getNextPageParam,
    initialPageParam: 1,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Concatenate all data pages into a single array
  const templateList = data?.pages?.flatMap((page) => page?.data?.data || []) || [];

  return {
    templateList,
    // Lazy pagination props
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

export const useWebasystApplicationList = () => {
  const getAppList = () => api.crossApp.apps();
  const { data, refetch } = useSuspenseQuery<Response<WebasystApp[]>>({
    queryKey: [STATE_TYPES.WEBASYST_APP_LIST],
    queryFn: getAppList,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    appList: data?.data ?? [],
    refetch,
  };
};

export const useProjectList = (filters: SearchParams = {}) => {
  const queryClient = useQueryClient();
  const getProjectList = () => api.project.getProjectList(filters);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery<
    PaginatedResponse<Project>
  >({
    queryKey: [STATE_TYPES.PROJECT_LIST],
    queryFn: getProjectList,
    getNextPageParam,
    initialPageParam: 1,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
  const createProject = (payload: CreateProjectPayload) => api.project.createProject(payload);
  const { mutateAsync: mutateCreateProject, isPending: isCreating } = useMutation(
    {
      mutationFn: createProject,
      // onSuccess: async (response) => {
      //   prependLazyPaginatedListEntity(queryClient, [STATE_TYPES.PROJECT_LIST], response);
      // },
      onSettled: async () => {
        return queryClient.invalidateQueries({ queryKey: [STATE_TYPES.PROJECT_LIST] });
      },
    },
    queryClient
  );

  const deleteProject = (id: Project['id']) => api.project.deleteProject(id);
  const { mutateAsync: mutateDeleteProject, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteProject,
      onSettled: async () => {
        return queryClient.invalidateQueries({ queryKey: [STATE_TYPES.PROJECT_LIST] });
      },
    },
    queryClient
  );

  // Concatenate all data pages into a single array
  const projectList = data?.pages?.flatMap((page) => page?.data?.data || []) || [];

  return {
    projectList,
    createProject: mutateCreateProject,
    deleteProject: mutateDeleteProject,
    isMutating: isCreating || isDeleting,
    // Lazy pagination props
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

export const useProjectListValidity = () => {
  const { projectList } = useProjectList();
  const { appList } = useWebasystApplicationList();

  const invalidProjects = useMemo(() => {
    return projectList.filter((project) => {
      if (appList.some((app) => app.theme_id_list.includes(project.theme_id))) {
        return false;
      }
      return true;
    });
  }, []);

  return {
    invalidProjects,
  };
};
