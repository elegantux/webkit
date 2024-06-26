import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  CreateTemplatePayload,
  Template,
  TemplateProject,
  TemplateRequestParams,
  UpdateTemplatePayload,
} from '@lib/models/template';
import { PaginatedResponse, Response, SearchParams } from '@lib/models/response';
import { api } from '@lib/api';
import { CreateProjectPayload, Project, UpdateProjectPayload } from '@lib/models/project';
import { getNextPageParam } from '@lib/utils/state-utils';
import { WebasystApp, WebasystSettings } from '@lib/models/cross-app';
import { ImageAsset } from '@lib/models/asset';
import { ThemeSettings, UpdateThemeSettingsPayload } from './models/theme-settings';

// Constants
export const STATE_TYPES = {
  TEMPLATE: 'template',
  TEMPLATE_LIST: 'template_list',
  RECENT_TEMPLATE_LIST: 'recent_template_list',
  TEMPLATE_PROJECT: 'template_project',
  PROJECT: 'project',
  PROJECT_LIST: 'project_list',
  THEME_SETTINGS: 'theme_settings',
  WEBASYST_APP_LIST: 'webasyst_app_list',
  WEBASYST_SETTINGS: 'webasyst_settings',
  IMAGE_ASSET_LIST: 'image_asset_list',
};

const sharedTemplateMethods = (queryKey: any[]) => {
  const queryClient = useQueryClient();

  const updateTemplate = ({ templateId, payload }: { templateId: Template['id']; payload: UpdateTemplatePayload }) =>
    api.template.updateTemplate(templateId, payload);
  const { mutateAsync: mutateUpdateTemplate, isPending: isUpdating } = useMutation(
    {
      mutationFn: updateTemplate,
      onSettled: async () => {
        return queryClient.invalidateQueries({ queryKey });
      },
    },
    queryClient
  );

  return {
    mutateUpdateTemplate,
    isUpdating,
  };
};

export const useTemplate = (templateId: Template['id']) => {
  const queryKey = [STATE_TYPES.TEMPLATE, templateId];

  const getTemplate = () => api.template.getTemplate(templateId);
  const { data } = useSuspenseQuery<Response<Template>>({
    queryKey,
    queryFn: getTemplate,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const { mutateUpdateTemplate, isUpdating } = sharedTemplateMethods(queryKey);

  return {
    template: data.data,
    updateTemplate: mutateUpdateTemplate,
    isLoading: isUpdating,
  };
};

export const useTemplateProject = (wtpId: TemplateProject['wtp_id']) => {
  const queryKey = [STATE_TYPES.TEMPLATE_PROJECT, wtpId];

  const getTemplateProject = () => api.template.getTemplateProject(wtpId);
  const { data } = useSuspenseQuery<Response<TemplateProject>>({
    queryKey,
    queryFn: getTemplateProject,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    templateProject: data.data,
  };
};

export const useTemplateList = (projectId: Project['id'], filters: TemplateRequestParams = {}) => {
  const queryClient = useQueryClient();
  const queryKey = [STATE_TYPES.TEMPLATE_LIST, projectId, filters];

  const getTemplateList = () => api.template.getTemplateList(projectId, filters);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery<
    PaginatedResponse<Template[]>
  >({
    queryKey,
    queryFn: getTemplateList,
    getNextPageParam,
    initialPageParam: 1,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const createTemplate = (payload: CreateTemplatePayload) => api.template.createTemplate(payload);
  const { mutateAsync: mutateCreateTemplate, isPending: isCreating } = useMutation(
    {
      mutationFn: createTemplate,
      onSettled: async () => {
        return queryClient.invalidateQueries({ queryKey });
      },
    },
    queryClient
  );

  const { mutateUpdateTemplate, isUpdating } = sharedTemplateMethods(queryKey);
  // const updateTemplate = ({ templateId, payload }: { templateId: Template['id']; payload: UpdateTemplatePayload }) =>
  //   api.template.updateTemplate(templateId, payload);
  // const { mutateAsync: mutateUpdateTemplate, isPending: isUpdating } = useMutation(
  //   {
  //     mutationFn: updateTemplate,
  //     onSettled: async () => {
  //       return queryClient.invalidateQueries({ queryKey });
  //     },
  //   },
  //   queryClient
  // );

  const deleteTemplate = (id: Template['id']) => api.template.deleteTemplate(id);
  const { mutateAsync: mutateDeleteTemplate, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteTemplate,
      onSettled: async () => {
        return queryClient.invalidateQueries({ queryKey });
      },
    },
    queryClient
  );

  // Concatenate all data pages into a single array
  const templateList = data?.pages?.flatMap((page) => page?.data?.data || []) || [];

  return {
    templateList,
    createTemplate: mutateCreateTemplate,
    updateTemplate: mutateUpdateTemplate,
    deleteTemplate: mutateDeleteTemplate,
    isLoading: isCreating || isUpdating || isDeleting,
    // Lazy pagination props
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

export const useRecentTemplateList = () => {
  const queryKey = [STATE_TYPES.RECENT_TEMPLATE_LIST];

  const getRecentTemplateList = () => api.template.getRecentTemplateList();
  const { data, isLoading } = useQuery<Response<Template[]>>({
    queryKey,
    queryFn: getRecentTemplateList,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    templateList: data?.data ?? [],
    isLoading,
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

export const useWebasystSettings = () => {
  const getWebasystSettings = () => api.crossApp.getWebasystSettings();
  const { data } = useSuspenseQuery<Response<WebasystSettings>>({
    queryKey: [STATE_TYPES.WEBASYST_SETTINGS],
    queryFn: getWebasystSettings,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    settings: data?.data!,
  };
};

export const useProjectList = (filters: SearchParams = {}) => {
  const queryClient = useQueryClient();
  const getProjectList = () => api.project.getProjectList(filters);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery<
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
      onSettled: async () => {
        return queryClient.invalidateQueries({ queryKey: [STATE_TYPES.PROJECT_LIST] });
      },
    },
    queryClient
  );

  const updateProject = ({ id, payload }: { id: Project['id']; payload: UpdateProjectPayload }) =>
    api.project.updateProject(id, payload);
  const { mutateAsync: mutateUpdateProject, isPending: isUpdating } = useMutation(
    {
      mutationFn: updateProject,
      // @ts-ignore
      onSettled: async (response, error, variables) => {
        await queryClient.invalidateQueries({ queryKey: [STATE_TYPES.PROJECT, variables.id] });
        return queryClient.invalidateQueries({ queryKey: [STATE_TYPES.PROJECT_LIST] });
      },
    },
    queryClient
  );

  const deleteProject = (id: Project['id']) => api.project.deleteProject(id);
  const { mutateAsync: mutateDeleteProject, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteProject,
      // @ts-ignore
      onSettled: async (response, error, projectId) => {
        /**
         * This runs another request(fetch) for a project that has already been removed from the DB,
         * resulting in a "Project not found" response error.
         * For now, it makes sense to not clear the cache right away so that it clears after 30 minutes.
         * https://tanstack.com/router/latest/docs/framework/react/api/router/RouteOptionsType#gctime-property
         */
        queryClient.removeQueries({ queryKey: [STATE_TYPES.PROJECT, projectId] });
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
    updateProject: mutateUpdateProject,
    deleteProject: mutateDeleteProject,
    isMutating: isCreating || isUpdating || isDeleting,
    isLoading,
    // Lazy pagination props
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
};

export const useProject = (projectId: Project['id']) => {
  const getProjectList = () => api.project.getProject(projectId);
  const { data } = useSuspenseQuery<Response<Project>>({
    queryKey: [STATE_TYPES.PROJECT, projectId],
    queryFn: getProjectList,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return { project: data.data };
};

export const useProjectListValidity = () => {
  const { projectList } = useProjectList();
  const { appList } = useWebasystApplicationList();

  const invalidProjects = useMemo(() => {
    return projectList.filter((project) => {
      if (appList.find((app) => app.app_id === project.app_id && app.theme_id_list.includes(project.theme_id))) {
        return false;
      }
      return true;
    });
  }, [projectList, appList]);

  return {
    invalidProjects,
  };
};

export const useThemeSettings = (projectId: Project['id']) => {
  const queryClient = useQueryClient();
  const queryKey = [STATE_TYPES.THEME_SETTINGS, projectId];

  const getThemeSettings = () => api.project.getThemeSettings(projectId);
  const { data } = useSuspenseQuery<Response<ThemeSettings>>({
    queryKey,
    queryFn: getThemeSettings,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const updateThemeSettings = ({ id, payload }: { id: ThemeSettings['id']; payload: UpdateThemeSettingsPayload }) =>
    api.project.updateThemeSettings(id, payload);
  const { mutateAsync: mutateUpdateThemeSettings } = useMutation({
    mutationFn: updateThemeSettings,
    onSettled: async () => {
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  return { themeSettings: data.data, updateThemeSettings: mutateUpdateThemeSettings };
};

export const useImageAssetList = () => {
  const queryClient = useQueryClient();

  const getImageList = () => api.assets.getImageList();
  const { data } = useSuspenseQuery<Response<ImageAsset[]>>({
    queryKey: [STATE_TYPES.IMAGE_ASSET_LIST],
    queryFn: getImageList,
    notifyOnChangeProps: ['data', 'error'],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const addImage = (file: File) => api.assets.addImage(file);
  const { mutateAsync: mutateAddImage } = useMutation({
    mutationFn: addImage,
    onSettled: async () => {
      return queryClient.invalidateQueries({ queryKey: [STATE_TYPES.IMAGE_ASSET_LIST] });
    },
  });

  const deleteImage = (id: ImageAsset['id']) => api.assets.deleteImage(id);
  const { mutateAsync: mutateDeleteImage } = useMutation({
    mutationFn: deleteImage,
    onSettled: async () => {
      return queryClient.invalidateQueries({ queryKey: [STATE_TYPES.IMAGE_ASSET_LIST] });
    },
  });

  return {
    imageList: data?.data ?? [],
    addImage: mutateAddImage,
    deleteImage: mutateDeleteImage,
  };
};
