import React from "react";
import styled from "@emotion/styled";
import { Avatar, Typography } from "@mui/material";
import theme from "../../../utils/theme";

const MessageBubbleRight = ({ message, time }) => {
  return (
    <ChatMessageContainer>
      <TextContainer>
        <MessageContainer>
          <TimeStamp>{time}</TimeStamp>
          <MessageBubble>
            <Message>{message}</Message>
          </MessageBubble>
        </MessageContainer>
      </TextContainer>
    </ChatMessageContainer>
  );
};

const ChatMessageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 5px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 6px;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 5px;
`;

const MessageBubble = styled.div`
  border: 1px solid ${theme.color.primary};
  border-radius: 10px 1px 10px 10px;
  background-color: ${theme.color.secondary};
  padding: 10px;
`;

const Message = styled(Typography)`
  font-size: 14px;
`;

const TimeStamp = styled(Typography)`
  font-size: 12px;
  color: ${theme.color.gray2};
  width: 100%;
`;

export default MessageBubbleRight;
