import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Input,
  Button,
  Modal,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
} from "@mui/material";
import { MoreVert, PushPin } from "@mui/icons-material";

import theme from "../../../utils/theme";
import MessageBubbleLeft from "./MessageBubbleLeft";
import MessageBubbleRight from "./MessageBubbleRight";
import JoiningMessage from "./JoiningMessage";
import {
  getSocket,
  sendMessage,
  isInRoom,
  joinRoom,
  leaveRoom,
} from "../../../utils/socket";

const socket = getSocket();

const ChatRoom = ({ username, currentRoom }) => {
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message);
      setMessages([...messages, message]);
      console.log("all Messages", messages);
    });
  }, [messages]);

  useEffect(() => {
    isInRoom(currentRoom);
    socket.on("checkRoomResult", ({ isJoin, name }) => {
      if (name === username) {
        if (isJoin) {
          setIsJoinRoom(true);
        } else {
          setIsJoinRoom(false);
        }
      }
    });
  }, [currentRoom]);

  useEffect(() => {
    socket.on("roomUsers", ({ users }) => {
      setUsersList(users);
    });
  }, []);

  useEffect(() => {
    socket.on("sendPinnedMessage", (message) => {
      setPinnedMessage(message);
    });
  }, [pinnedMessage]);

  const onOpenModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const onCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const onLeaveRoom = () => {
    setIsMenuOpen(false);
    leaveRoom(currentRoom);
    setIsJoinRoom(false);
  };

  const onSend = (event) => {
    event.preventDefault();
    const message = event.target[0].value;
    sendMessage(message);
  };

  const onJoinRoom = () => {
    joinRoom(username, currentRoom);
    setIsJoinRoom(true);
  };

  const ChatPage = () => {
    return (
      <ContentContainer>
        <NameWrapper>
          <RoomTitle>{currentRoom}</RoomTitle>
          <Modal
            open={isModalOpen}
            onClose={onCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
          >
            <ModalContainer>
              <ModalTitleContainer id="modal-title">
                <ModalTitle>Users List</ModalTitle>
                <Button
                  onClick={onCloseModal}
                  sx={{ backgroundColor: theme.color.white, margin: "10px" }}
                >
                  Close
                </Button>
              </ModalTitleContainer>
              <UsersListContainer id="modal-desc">
                {usersList.map((user) => (
                  <p>{user.username}</p>
                ))}
              </UsersListContainer>
            </ModalContainer>
          </Modal>
          <IconButton onClick={onOpenMenu}>
            <MoreVert />
          </IconButton>
          <Menu
            open={isMenuOpen}
            onClose={onCloseMenu}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <MenuItem onClick={onLeaveRoom}>Leave Room</MenuItem>
            <MenuItem onClick={onOpenModal}>Users List</MenuItem>
          </Menu>
        </NameWrapper>
        {pinnedMessage !== null && (
          <PinnedMessageContainer>
            <PushPin sx={{ transform: "rotate(45deg)" }} />
            {pinnedMessage.username} : {pinnedMessage.time} {" >> "}
            {pinnedMessage.text}
          </PinnedMessageContainer>
        )}

        <ChatContent>
          {messages.map((msg) =>
            msg.username === undefined ? (
              <JoiningMessage message={msg.text} />
            ) : msg.username === username ? (
              <MessageBubbleRight
                message={msg.text}
                time={msg.time}
                room={currentRoom}
              />
            ) : (
              <MessageBubbleLeft
                name={msg.username}
                message={msg.text}
                time={msg.time}
              />
            )
          )}
        </ChatContent>
        <MessageContainer>
          <FormContainer onSubmit={onSend}>
            <FormControl variant="standard" sx={{ width: "85%" }}>
              <Input
                id="user-message"
                placeholder="Enter a message"
                disableUnderline
                sx={{
                  fontSize: "1rem",
                  width: "100%",
                  height: "80%",
                  backgroundColor: theme.color.white,
                  borderRadius: "10px",
                  margin: "10px",
                  paddingLeft: "10px",
                }}
              />
            </FormControl>
            <Button
              type="join"
              sx={{ backgroundColor: theme.color.white, margin: "10px" }}
            >
              Send
            </Button>
          </FormContainer>
        </MessageContainer>
      </ContentContainer>
    );
  };

  const JoinPage = () => {
    return (
      <ContentContainer>
        <div>{currentRoom}</div>
        <Button onClick={onJoinRoom}>Join</Button>
      </ContentContainer>
    );
  };

  return <>{isJoinRoom ? <ChatPage /> : <JoinPage />}</>;
};

export default ChatRoom;

const ContentContainer = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const NameWrapper = styled.div`
  width: 100%;
  height: 6%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 7px;
  background-color: ${theme.color.primary};
`;

const PinnedMessageContainer = styled.div`
  width: 100%;
  height: 6%;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.25rem;
  gap: 10px;
  padding-left: 5px;
  background-color: ${theme.color.gray0};
`;

const RoomTitle = styled.p`
  font-size: 2.25rem;
  margin: 0;
`;

const MessageContainer = styled.div`
  width: 100%;
  height: 6%;
  background-color: ${theme.color.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  justify-content: space-between;
`;

const ChatContent = styled.div`
  width: 100%;
  height: 88%;
  overflow-y: scroll;
`;

const ModalContainer = styled.div`
  width: 50%;
  height: 50%;
  transform: translate(50%, 50%);
  overflow-y: scroll;
  background-color: ${theme.color.white};
`;

const ModalTitleContainer = styled.div`
  height: 12%;
  display: flex;
  flex-display: row;
  justify-content: space-between;
  background-color: ${theme.color.primary};
  // font-size: 2rem;
  margin: 0;
`;

const ModalTitle = styled.p`
  font-size: 2.25rem;
  margin: 0;
`;

const UsersListContainer = styled.div`
  height: 88%;
  overflow-y: scroll;
`;
