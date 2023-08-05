import { configService } from './config.service';
import { Socket, io } from 'socket.io-client';
import { authService, TokenTypesEnum } from './auth.service';
import { CreateMessageDto, MessageResponse } from './messages.service';

interface ServerToClientEvents {
  newMessage: (data: MessageResponse, callback: (data: MessageResponse) => void) => void;
}

interface ClientToServerEvents {
  sendMessage: (data: CreateMessageDto, callback: (data: MessageResponse) => void) => void;
}

export class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io(configService.BASE_URL, {
      autoConnect: false,
      reconnectionDelay: 5000,
    });

    console.log('SOCKET CREATED', this.socket);
  }

  private setAuth() {
    const token = authService.getToken(TokenTypesEnum.accessToken);

    if (token) {
      this.socket.auth = { token: `Bearer ${token}` };
    }
  }

  public connect() {
    if (this.socket.connected) {
      return;
    }

    this.setAuth();

    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public reconnect() {
    this.disconnect();
    this.connect();
  }

  public sendMessage(message: CreateMessageDto): Promise<MessageResponse> {
    if (!this.socket.auth) {
      this.setAuth();
    }

    return this.socket.emitWithAck('sendMessage', message);
  }

  public subscribe(
    handler: (data: MessageResponse, callback: (data: MessageResponse) => void) => void,
  ): void {
    this.socket.off('newMessage');
    this.socket.on('newMessage', handler);
  }
}

export const socketService = new SocketService();
