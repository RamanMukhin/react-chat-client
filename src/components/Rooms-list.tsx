import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RoomResponse, roomsService } from '../services/rooms.service';

const RoomListContainer = styled.div<{ open?: string }>`
  --space: 1em;
  --horizontal-space: 2vw;

  display: flex;
  flex-direction: column;
  height: 100%;
  color: #5f3131;

  & h3 {
    font-size: 1.2em;
    font-weight: 500;
    padding: 0.9em var(--horizontal-space);
  }

  @media (max-width: 820px) {
    position: absolute;
    opacity: ${(props) => (props.open ? '1' : '0')};
    pointer-events: ${(props) => (props.open ? 'null' : 'none')};
    right: 0;
    width: 100%;
    border-radius: 0;
    z-index: 1;
  }
`;

const RoomItem = styled.li<{ $active?: unknown }>`
  display: flex;
  width: 100%;
  flex: 3;
  padding: var(--space) var(--horizontal-space);
  list-style: none;
  background: ${(props) => (props.$active ? 'var(--blue-active-color)' : 'transparent')};
  transition: all 0.05s;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: #b8df7c;
  }

  & img {
    height: 3vw;
    width: 3vw;
    border-radius: 20px;
    object-fit: cover;
  }

  & div {
    display: flex;
    align-items: center;
  }

  & span {
    font-weight: 500;
    font-size: 0.8em;
  }
`;

interface IRoomListProps {
  roomClickHandler: (roomId: string) => void;
  currentRoomId: string;
}

const RoomsList = ({ roomClickHandler, currentRoomId }: IRoomListProps) => {
  const [rooms, setRooms] = useState([] as RoomResponse[]);

  useEffect(() => {
    roomsService
      .getRooms()
      .then((rooms: RoomResponse[]) => {
        setRooms(rooms);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <RoomListContainer>
      <h3>Rooms</h3>

      <ul>
        {rooms.map((room) => {
          const { _id, name } = room;

          return (
            <RoomItem
              $active={currentRoomId === _id}
              key={_id}
              onClick={() => roomClickHandler(_id)}
            >
              <div>
                <img src="vite.svg"></img>
                {/* <span>{name ? name : `Room ${_id}`}</span> */}
                <span>{name ? `Room ${_id}` : `Room ${_id}`}</span>
              </div>
            </RoomItem>
          );
        })}
      </ul>
    </RoomListContainer>
  );
};

export default RoomsList;
