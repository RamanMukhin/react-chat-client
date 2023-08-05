import { Pagination } from '../common/types';
import { configService } from './config.service';
import httpClient from './http-client.service';
import { AxiosRequestConfig } from 'axios';
import { MessageResponse } from './messages.service';

export type RoomResponse = {
  _id: string;
  name: string;
  creatorId: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
};

type GetRoomsResponse = RoomResponse[];

export type RoomWithMessagesResponse = RoomResponse & { messages: MessageResponse[] };

export class RoomsService {
  private API_ENDPOINTS = {
    rooms: '/rooms/',
    getRoomById: (id: string) => `/rooms/${id}`,
    joinRoom: (id: string) => `/rooms/${id}`,
  };

  // private checkStatus(recieved: number, expected: number): void {}

  public async getRooms(pagination?: Pagination): Promise<GetRoomsResponse> {
    try {
      const config: AxiosRequestConfig = pagination
        ? {
            params: pagination,
          }
        : {};

      const getRoomsRequest = await httpClient.get<GetRoomsResponse>(
        this.API_ENDPOINTS.rooms,
        config,
      );

      if (getRoomsRequest.status !== configService.HTTP_CONSTANTS.SUCCESS) {
        return Promise.reject(`Incorrect status ${getRoomsRequest.status}`);
      }

      return getRoomsRequest.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getRoomWithMessages(
    roomId: string,
    pagination?: Pagination,
  ): Promise<RoomWithMessagesResponse> {
    try {
      const config: AxiosRequestConfig = pagination
        ? {
            params: pagination,
          }
        : {};

      const getRoomWithMessagesRequest = await httpClient.get<RoomWithMessagesResponse>(
        this.API_ENDPOINTS.getRoomById(roomId),
        config,
      );

      if (getRoomWithMessagesRequest.status !== configService.HTTP_CONSTANTS.SUCCESS) {
        return Promise.reject(`Incorrect status ${getRoomWithMessagesRequest.status}`);
      }

      return getRoomWithMessagesRequest.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async joinRoom(roomId: string): Promise<void> {
    try {
      const getRoomsRequest = await httpClient.put<RoomResponse>(
        this.API_ENDPOINTS.joinRoom(roomId),
      );

      if (getRoomsRequest.status !== configService.HTTP_CONSTANTS.SUCCESS) {
        return Promise.reject(`Incorrect status ${getRoomsRequest.status}`);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const roomsService = new RoomsService();
