import axios from 'axios';

import { Response } from '@lib/models/response';
import ApiError from '@lib/classes/ApiError';
import { HOST, WA_APP_URL } from '@lib/constants';
import { Template } from '@lib/models/template';

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
};

export const api = { template };
