import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { useStores } from '../hooks/use-stores.hook';
import { useEffect } from 'react';
import { MessageResponse } from '../services/messages.service';
import { socketService } from '../services/socket.service';

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;

  gap: 1vh;
  flex: 1;
  padding: 20px 0;
  overflow: auto;
`;

const MessageContent = styled.div`
  display: flex;
  font-size: 0.8em;
  font-weight: 300;
  padding: 0.8em 1em;
  width: fit-content;
  height: fit-content;
`;

const MessageContainer = styled.div<{ $incomingMessage?: boolean }>`
  display: flex;
  gap: 20px;
  color: #fff;
  font-size: 1rem;
  flex-direction: ${(props) => (props.$incomingMessage ? 'row' : 'row-reverse')};

  ${MessageContent} {
    background: ${(props) => (props.$incomingMessage ? 'var(--blue-gradient)' : '#fff')};
    border: ${(props) => (props.$incomingMessage ? 'none' : '1px solid rgba(0, 0, 0, 0.1)')};
    color: ${(props) => (props.$incomingMessage ? '#e14a4a' : '#000')};
    box-shadow: ${(props) =>
        props.$incomingMessage ? 'rgba(32, 112, 198, 0.4)' : 'rgba(0, 0, 0, 0.15)'}
      2px 3px 15px;
    border-radius: ${(props) => (props.$incomingMessage ? '0 8px 8px 8px' : '8px 0 8px 8px')};
  }
`;

const UserProfile = styled.div`
  display: flex;
  position: relative;
  height: 100%;

  &::before {
    display: grid;
    place-content: center;
    padding: 0.5em;
    width: 1.3em;
    height: 1.3em;
    border-radius: 50%;
    background: var(--secondry-color-dark-palette);
  }
`;

interface IConversationProps {
  currentRoom: string;
}

const Conversation = observer(({ currentRoom }: IConversationProps) => {
  console.log('Render CONVERSATION!!!');
  const { userStore } = useStores();

  useEffect(() => {
    socketService.subscribe((data: MessageResponse, callback: (data: MessageResponse) => void) => {
      if (currentRoom === data.roomId) {
        const messages = [...userStore.messages[currentRoom]];
        const msg = toJS(userStore.messages[currentRoom][0]);
        console.log(111111, msg);
        console.log(22222, data);
        console.log(33333, msg, data);

        if (
          data.creatorId === msg.creatorId &&
          data.type === msg.type &&
          data.data === msg.data &&
          +new Date(data.createdAt) === +new Date(msg.createdAt)
        ) {
          console.log(555555, data);
          messages[0] = data;
          userStore.setMessages(currentRoom, messages);
          return callback(data);
        }
        console.log(666666, data);
        // userStore.setMessages(currentRoom, [data, ...userStore.messages[currentRoom]]);
        userStore.setMessages(currentRoom, [data, ...messages]);
        return callback(data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom]);

  return (
    <ConversationContainer>
      {userStore.messages[currentRoom] &&
        userStore.messages[currentRoom].map((m) => {
          return (
            <MessageContainer key={m._id} $incomingMessage={m.creatorId !== userStore._id}>
              <UserProfile content={m.creatorId} />
              <MessageContent>
                {m.data}
                <br />
                <br />
                sent:{' '}
                {new Date(m.createdAt).toLocaleDateString([navigator.language], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </MessageContent>
            </MessageContainer>
          );
        })}
    </ConversationContainer>
  );
});

export default Conversation;
