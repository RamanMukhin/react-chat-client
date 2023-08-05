import styled from 'styled-components';
import RoomsList from './Rooms-list';
import Conversation from './Conversation';
import { useEffect, useState } from 'react';
import { useStores } from '../hooks/use-stores.hook';
import ChatForm from './Chat-form';
import { roomsService } from '../services/rooms.service';
import { socketService } from '../services/socket.service';

const ChatAppContainer = styled.div`
  overflow: hidden;
  /* --vertical-padding: 3vh; */

  display: flex;
  gap: 2vw;
  height: 80vh;
  width: 80vw;
  justify-content: space-between;
  background: #e5e7e8;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
    rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px,
    rgba(0, 0, 0, 0.09) 0px -3px 5px;

  @media (max-width: 820px) {
    position: relative;
    width: 100%;
    height: 100vh;
    flex-direction: column-reverse;
    font-size: 0.85rem;
    gap: 0;
  }
`;

const CenterContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 1.5vw;
  flex-direction: column;
  height: 100%;
  margin: auto 0;

  @media (max-width: 820px) {
    height: 80%;
  }
`;

const ChatContainer = () => {
  const [currentRoom, setCurrentRoom] = useState('');

  const { userStore } = useStores();

  useEffect(() => {
    if (currentRoom && !userStore.messages[currentRoom]) {
      
      const getRoomWithMessages = async () => {
        const roomWithMessages = await roomsService.getRoomWithMessages(currentRoom);

        const participantsSet = new Set(roomWithMessages.participants);

        if (!participantsSet.has(userStore._id)) {
          await roomsService.joinRoom(currentRoom);
          socketService.reconnect();
        }

        userStore.setMessages(currentRoom, roomWithMessages.messages);
      };

      void getRoomWithMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom]);

  const roomClickHandler = (roomID: string) => {
    if (currentRoom === roomID) {
      return;
    }

    setCurrentRoom(roomID);
  };

  return (
    <ChatAppContainer>
      <CenterContainer>
        <Conversation currentRoom={currentRoom} />
        {currentRoom ? <ChatForm currentRoom={currentRoom} /> : ''}
      </CenterContainer>

      <RoomsList roomClickHandler={roomClickHandler} currentRoomId={currentRoom} />
    </ChatAppContainer>
  );
};

export default ChatContainer;
