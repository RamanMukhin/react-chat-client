import { Pagination } from '../common/types';
import { configService } from './config.service';
import httpClient from './http-client.service';
import { AxiosRequestConfig } from 'axios';
import { socketService } from './socket.service';

export enum MessageTypesEnum {
  text = 'text',
  file = 'file',
}

export type MessageResponse = {
  _id: string;
  type: string;
  roomId: string;
  creatorId: string;
  data: string;
  createdAt: string;
  updatedAt: string;
};
type GetMessagesResponse = MessageResponse[];

export type CreateMessageDto = {
  data: string;
  roomId: string;
  type: MessageTypesEnum;
};

export class MessagesService {
  private API_ENDPOINTS = {
    messages: '/messages/',
    getMessageById: (id: string) => `/messages/${id}`,
  };

  public async getRoomMessages(
    roomId: string,
    pagination?: Pagination,
  ): Promise<GetMessagesResponse> {
    try {
      const config: AxiosRequestConfig = {
        params: {
          roomId,
        },
      };

      if (pagination) {
        config.params = {
          ...config.params,
          ...pagination,
        };
      }

      const getMessagesRequest = await httpClient.get<GetMessagesResponse>(
        this.API_ENDPOINTS.messages,
        config,
      );

      if (getMessagesRequest.status !== configService.HTTP_CONSTANTS.SUCCESS) {
        return Promise.reject(`Incorrect status ${getMessagesRequest.status}`);
      }

      return getMessagesRequest.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async sendMessage(message: CreateMessageDto): Promise<MessageResponse> {
    try {
      const createdMessage = await socketService.sendMessage(message);

      return createdMessage;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const messagesService = new MessagesService();
