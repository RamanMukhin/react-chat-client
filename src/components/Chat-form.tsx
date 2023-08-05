import { FormEvent, useRef } from 'react';
import styled from 'styled-components';
import { CreateMessageDto, MessageTypesEnum, messagesService } from '../services/messages.service';
import { utilsService } from '../services/utils.service';
import { configService } from '../services/config.service';
import { useStores } from '../hooks/use-stores.hook';

const MessageForm = styled.form`
  padding: 0.5vw 0;
  display: flex;
  align-items: center;
  height: 10%;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  & button {
    background-color: red;
    margin-left: 5px;
  }

  & input {
    flex: 1;
    height: 100%;
    width: 100%;
    border: none;
    border-radius: 10px;
  }
`;

interface IChatFormProps {
  currentRoom: string;
}

const ChatForm = ({ currentRoom }: IChatFormProps) => {
  console.log('Render CONVERSATION!!!');
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSubmit = useRef<number | null>(null);

  const { userStore } = useStores();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = inputRef.current?.value;

    if (!data || !utilsService.canInvoke(configService.TIME_DELAYS.throttle, lastSubmit)) {
      return;
    }

    const message: CreateMessageDto = {
      type: MessageTypesEnum.text,
      roomId: currentRoom,
      data,
    };

    const now = new Date().toString();

    const msg = {
      _id: now,
      ...message,
      createdAt: now,
      updatedAt: now,
      creatorId: userStore._id,
    };

    void messagesService.sendMessage(message);

    inputRef.current.value = '';
    userStore.setMessages(currentRoom, [{ ...msg }, ...userStore.messages[currentRoom]]);
  };

  return (
    <MessageForm onSubmit={onSubmit}>
      <input type="text" placeholder="Type a message here" ref={inputRef} />

      <button type="submit">SEND</button>
    </MessageForm>
  );
};

export default ChatForm;
