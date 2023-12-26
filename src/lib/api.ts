import axios from 'axios';

import { Response } from '@lib/models/response';
import ApiError from '@lib/classes/ApiError';
import { HOST, WA_APP_URL } from '@lib/constants';

const base = {
  async getSome() {
    const { data, status } = await axios.get<Response<string>>(`${HOST}${WA_APP_URL}?module=default&action=info`, {
      headers: {},
    });

    if (status !== 200) {
      throw new ApiError(data);
    }

    return data;
  },
};

export { base };
