import axios from 'axios';

import { PaginatedResponse, Response, SearchParams } from '@lib/models/response';
import ApiError from '@lib/classes/ApiError';
import { HOST, WA_APP_URL, WA_BACKEND_URL } from '@lib/constants';
import {
  CreateTemplatePayload,
  Template,
  TemplateProject,
  TemplateRequestParams,
  UpdateTemplatePayload,
} from '@lib/models/template';
import { CreateProjectPayload, PROJECT_APP_IDS, Project, UpdateProjectPayload } from '@lib/models/project';
import { createFormData } from '@lib/utils';
import { CreateSettlementPayload, SiteDomain, WebasystApp, WebasystSettings } from '@lib/models/cross-app';
import { ImageAsset } from '@lib/models/asset';
import { ThemeSettings, UpdateThemeSettingsPayload } from './models/theme-settings';

const template = {
  async getTemplate(templateId: Template['id']) {
    const { data, status } = await axios.get<Response<Template>>(
      `${HOST}${WA_APP_URL}?module=template&id=${templateId}`,
      {
        headers: {},
      }
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getTemplateList(projectId: Project['id'], searchParams?: TemplateRequestParams) {
    const params = {
      module: 'templateList',
      project_id: projectId,
      ...(searchParams ?? searchParams),
    };

    const { data, status } = await axios.get<PaginatedResponse<Template[]>>(`${HOST}${WA_APP_URL}`, {
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getRecentTemplateList() {
    const params = {
      module: 'recentTemplateList',
    };

    const { data, status } = await axios.get<Response<Template[]>>(`${HOST}${WA_APP_URL}`, {
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getTemplateProject(wtpId: TemplateProject['wtp_id']) {
    const params = {
      module: 'templateProject',
      id: wtpId,
    };

    const { data, status } = await axios.get<Response<TemplateProject>>(`${HOST}${WA_APP_URL}`, {
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async createTemplate(payload: CreateTemplatePayload) {
    const formData = createFormData();

    Object.keys(payload).forEach((key: string) => {
      // @ts-ignore
      formData.append(key, payload[key]);
    });

    const { data, status } = await axios.post<Response<Project>>(`${HOST}${WA_APP_URL}?module=templateAdd`, formData);

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async updateTemplate(templateId: Template['id'], payload: UpdateTemplatePayload) {
    const formData = createFormData();

    Object.keys(payload).forEach((key: string) => {
      // @ts-ignore
      formData.append(key, payload[key]);
    });

    const { data, status } = await axios.post<Response<Project>>(
      `${HOST}${WA_APP_URL}?module=templateUpdate&id=${templateId}`,
      formData
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async deleteTemplate(templateId: Template['id']) {
    const formData = createFormData();

    const { data, status } = await axios.post<Response<boolean>>(
      `${HOST}${WA_APP_URL}?module=templateDelete&id=${templateId}`,
      formData
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
};

const crossApp = {
  async apps() {
    const { data, status } = await axios.get<Response<WebasystApp[]>>(
      `${HOST}${WA_APP_URL}?module=crossApp&action=apps`,
      {
        headers: {},
      }
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getWebasystSettings() {
    const { data, status } = await axios.get<Response<WebasystSettings>>(
      `${HOST}${WA_APP_URL}?module=webasystSettings`,
      {
        headers: {},
      }
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getDomains() {
    const { data, status } = await axios.get<Response<SiteDomain[]>>(
      `${HOST}${WA_APP_URL}?module=siteDomain&action=getDomains`,
      {
        headers: {},
      }
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
};

const project = {
  async getProject(projectId: Project['id']) {
    const { data, status } = await axios.get<Response<Project>>(`${HOST}${WA_APP_URL}?module=project&id=${projectId}`, {
      headers: {},
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getProjectList(searchParams?: SearchParams) {
    const params = {
      module: 'projectList',
      ...(searchParams ?? searchParams),
    };

    const { data, status } = await axios.get<PaginatedResponse<Project>>(`${HOST}${WA_APP_URL}`, {
      headers: {},
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async createProject(payload: CreateProjectPayload) {
    const formData = createFormData();

    Object.keys(payload).forEach((key: string) => {
      // @ts-ignore
      formData.append(key, payload[key]);
    });

    const { data, status } = await axios.post<Response<Project>>(`${HOST}${WA_APP_URL}?module=projectAdd`, formData);

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async updateProject(projectId: Project['id'], payload: UpdateProjectPayload) {
    const formData = createFormData();

    Object.keys(payload).forEach((key: string) => {
      // @ts-ignore
      formData.append(key, payload[key]);
    });

    const { data, status } = await axios.post<Response<Project>>(
      `${HOST}${WA_APP_URL}?module=projectUpdate&id=${projectId}`,
      formData,
      {
        headers: {},
      }
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async deleteProject(projectId: Project['id']) {
    const formData = createFormData();
    const { data, status } = await axios.post<Response<Project>>(
      `${HOST}${WA_APP_URL}?module=projectDelete&id=${projectId}`,
      formData
    );

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getRecentProjectList() {
    const params = {
      module: 'recentProjectList',
    };

    const { data, status } = await axios.get<Response<Project[]>>(`${HOST}${WA_APP_URL}`, {
      headers: {},
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async getThemeSettings(projectId: Project['id']) {
    const params = {
      module: 'themeSettings',
      project_id: projectId,
    };

    const { data, status } = await axios.get<Response<ThemeSettings>>(`${HOST}${WA_APP_URL}`, {
      headers: {},
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async updateThemeSettings(id: ThemeSettings['id'], payload: UpdateThemeSettingsPayload) {
    const formData = createFormData();

    const params = {
      module: 'themeSettingsUpdate',
      id,
    };

    Object.keys(payload).forEach((key: string) => {
      // @ts-ignore
      formData.append(key, payload[key]);
    });

    const { data, status } = await axios.post<Response<ThemeSettings>>(`${HOST}${WA_APP_URL}`, formData, {
      headers: {},
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
};

const assets = {
  async getImageList() {
    const params = {
      module: 'assetImageList',
    };

    const { data, status } = await axios.get<Response<ImageAsset[]>>(`${HOST}${WA_APP_URL}`, {
      headers: {},
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async addImage(file: File) {
    const params = {
      module: 'assetImageAdd',
    };

    const formData = createFormData();
    formData.append('image', file);

    const { data, status } = await axios.post<Response<ImageAsset>>(`${HOST}${WA_APP_URL}`, formData, {
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
  async deleteImage(id: ImageAsset['id']) {
    const params = {
      module: 'assetImageDelete',
      id,
    };

    const formData = createFormData();

    const { data, status } = await axios.post<Response<boolean>>(`${HOST}${WA_APP_URL}`, formData, {
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
};

const prepareAppSettlementFormData = (data: CreateSettlementPayload) => {
  const formData = createFormData();

  if (data.app === PROJECT_APP_IDS.SITE) {
    formData.append('params[url]', data.url);
    formData.append('params[app]', data.app);
    formData.append('params[_name]', data.name);
    formData.append('params[theme]', data.theme);
    formData.append('params[theme_mobile]', data.theme);
    formData.append('params[locale]', data.locale);
    formData.append('params[private]', data.private ? '1' : '0');
    formData.append('other_params', '');
  } else if (data.app === PROJECT_APP_IDS.BLOG) {
    formData.append('params[url]', data.url);
    formData.append('params[app]', data.app);
    formData.append('params[_name]', data.name);
    formData.append('params[theme]', data.theme);
    formData.append('params[theme_mobile]', data.theme);
    formData.append('params[locale]', data.locale);
    formData.append('params[private]', data.private ? '1' : '0');
    formData.append('params[blog_url_type]', '1');
    formData.append('params[post_url_type]', '0');
    formData.append('params[title]', '1');
    formData.append('params[meta_keywords]', '');
    formData.append('params[meta_description]', '');
    formData.append('params[rss_title]', '1');
    formData.append('other_params', '');
  } else {
    throw new Error('A settlement cannot be created for a non-supported application.');
  }

  return formData;
};

const site = {
  async createSettlement(payload: CreateSettlementPayload) {
    const url = `${HOST}${WA_BACKEND_URL}/site`;
    const params = {
      module: 'routing',
      action: 'save',
      domain_id: payload.domain_id,
      route: '',
    };

    const formData = prepareAppSettlementFormData(payload);

    const { data, status } = await axios.post<Response<ImageAsset>>(url, formData, {
      params,
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
};

export const api = { template, project, crossApp, assets, site };
