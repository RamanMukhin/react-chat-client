import { TimeDelayTypesEnum } from './utils.service';

export class ConfigService {
  // public readonly BASE_URL = 'http://localhost:3001';
  public readonly BASE_URL = 'http://3.252.227.222:3043';
  

  public readonly TIME_DELAYS = {
    [TimeDelayTypesEnum.throttle]: 1000,
    [TimeDelayTypesEnum.debounce]: 2000,
  };

  public readonly HTTP_CONSTANTS = {
    SUCCESS: 200,
    CREATED: 201,
    DELETED: 204,

    ERRORS: {
      409: 409,
      400: 400,
      403: 403,
    },
  };
}

export const configService = new ConfigService();
