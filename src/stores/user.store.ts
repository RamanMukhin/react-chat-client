import { observable, action, makeObservable } from 'mobx';
import { MessageResponse } from '../services/messages.service';

export interface IUserStore {
  _id: string;
  login: string;
  authorized: boolean;
}

export default class UserStore implements IUserStore {
  _id = '';
  login = '';
  authorized = false;
  messages: Record<string, MessageResponse[]> = {};

  constructor() {
    makeObservable(this, {
      authorized: observable,
      messages: observable,
      setAuthorized: action,
      setMessages: action,
    });
  }

  setId = (id: string): void => {
    this._id = id;
  };

  setLogin = (login: string): void => {
    this.login = login;
  };

  setAuthorized = (authorized: boolean): void => {
    this.authorized = authorized;
  };

  setMessages = (roomId: string, messages: MessageResponse[]): void => {
    this.messages[roomId] = messages;
  };
}
