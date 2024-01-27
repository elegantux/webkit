import axios from 'axios';

import { PaginatedResponse, Response, SearchParams } from '@lib/models/response';
import ApiError from '@lib/classes/ApiError';
import { HOST, WA_APP_URL } from '@lib/constants';
import { Template } from '@lib/models/template';
import { CreateProjectPayload, Project, UpdateProjectPayload } from '@lib/models/project';
import { createFormData } from '@lib/utils';
import { WebasystApp } from '@lib/models/cross-app';

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
};

export const api = { template, project, crossApp };
