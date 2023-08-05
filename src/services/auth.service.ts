import { configService } from './config.service';
import httpClient from './http-client.service';
import UserStore from '../stores/user.store';

export enum TokenTypesEnum {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
}

type LoginResponse = { [TokenTypesEnum.accessToken]: string; [TokenTypesEnum.refreshToken]?: string };
type GetUserByIdResponse = { _id: string; login: string };

export class AuthService {
  private SESSION_STORAGE_KEYS = {
    accessToken: '@authentication/auth_token',
    refreshToken: '@authentication/auth_refresh_token',
  };

  private API_ENDPOINTS = {
    login: '/auth/sign-in/',
    getUserById: (id: string) => `/users/${id}`,
  };

  public async login(
    login: string | undefined,
    password: string | undefined,
    userStore: UserStore,
    highlight: (color: string) => void,
    fingerprint = 'string',
  ) {
    try {
      const loginRequest = await httpClient.post<LoginResponse>(
        this.API_ENDPOINTS.login,
        JSON.stringify({
          login,
          password,
          fingerprint,
        }),
      );

      if (loginRequest.status !== configService.HTTP_CONSTANTS.SUCCESS) {
        return Promise.reject(`Incorrect status ${loginRequest.status}`);
      }

      highlight('green');

      const { data: loginResponse } = loginRequest;

      if (!loginResponse.accessToken) {
        return Promise.reject('No token');
      }

      this.setAuthToken(loginResponse);

      const userId = this.extractUserIdFromToken(loginResponse.accessToken);

      if (!userId) {
        return Promise.reject('No id in payload');
      }

      const getUserByIdRequest = await httpClient.get<GetUserByIdResponse>(
        this.API_ENDPOINTS.getUserById(userId),
      );

      if (getUserByIdRequest.status !== configService.HTTP_CONSTANTS.SUCCESS) {
        this.removeTokens();

        return Promise.reject(`Incorrect status ${getUserByIdRequest.status}`);
      }

      userStore.setId(getUserByIdRequest.data._id);
      userStore.setLogin(getUserByIdRequest.data.login);
      userStore.setAuthorized(true);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private extractUserIdFromToken(token: string): string | null {
    try {
      const userId: string = JSON.parse(atob(token.split('.')[1]))?._id;

      return userId;
    } catch (error) {
      return null;
    }
  }

  private setAuthToken({ accessToken, refreshToken }: LoginResponse) {
    window.sessionStorage.setItem(this.SESSION_STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) {
      window.sessionStorage.setItem(this.SESSION_STORAGE_KEYS.refreshToken, refreshToken);
    }
  }

  public getToken(tokenType: TokenTypesEnum): string | null {
    try {
      const token = window.sessionStorage.getItem(this.SESSION_STORAGE_KEYS[tokenType]);

      if (!token) {
        return null;
      }

      return token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public removeTokens() {
    try {
      window.sessionStorage.removeItem(this.SESSION_STORAGE_KEYS.accessToken);
      window.sessionStorage.removeItem(this.SESSION_STORAGE_KEYS.refreshToken);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const authService = new AuthService();
