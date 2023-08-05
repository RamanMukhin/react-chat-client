import { Axios, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios';
import { configService } from './config.service';
import { TokenTypesEnum, authService } from './auth.service';

const httpClient = new Axios({ baseURL: configService.BASE_URL });

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => {
    config.headers['Content-Type'] = 'application/json';

    const token = authService.getToken(TokenTypesEnum.accessToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => console.log(err),
);

httpClient.interceptors.response.use((response: AxiosResponse) => {
  response.data = response.data && JSON.parse(response.data as string);

  if (
    ![configService.HTTP_CONSTANTS.SUCCESS, configService.HTTP_CONSTANTS.CREATED].includes(
      response.status,
    )
  ) {
    throw new Error((response.data && response.data.message) as string);
  }

  return response;
});

export default httpClient;
