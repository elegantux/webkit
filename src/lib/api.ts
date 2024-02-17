import axios from 'axios';

import { PaginatedResponse, Response, SearchParams } from '@lib/models/response';
import ApiError from '@lib/classes/ApiError';
import { HOST, WA_APP_URL } from '@lib/constants';
import { CreateTemplatePayload, Template, TemplateProject, UpdateTemplatePayload } from '@lib/models/template';
import { CreateProjectPayload, Project, UpdateProjectPayload } from '@lib/models/project';
import { createFormData } from '@lib/utils';
import { WebasystApp } from '@lib/models/cross-app';
import { ImageAsset } from '@lib/models/asset';

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
  async getTemplateList(projectId: Project['id'], searchParams?: SearchParams) {
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

export const api = { template, project, crossApp, assets };
