import axios from 'axios';

import { Response } from '@lib/models/response';
import ApiError from '@lib/classes/ApiError';
import { HOST, WA_APP_URL } from '@lib/constants';
import { Template } from '@lib/models/template';
import { PluginDependencies } from '@lib/models/plugin';

const editor = {
  async getPluginDependencies(templateId: Template['id']) {
    const { data, status } = await axios.get<Response<PluginDependencies>>(
      `${HOST}${WA_APP_URL}?module=editor&action=dependencies&template_id=${templateId}`,
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

export const api = { editor };
