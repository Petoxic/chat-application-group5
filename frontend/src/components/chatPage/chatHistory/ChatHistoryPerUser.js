import { Avatar, Typography } from "@mui/material";
import React from "react";
import styled from "@emotion/styled";
import theme from "../../../utils/theme";

const ChatHistoryPerUser = ({ name, message, timestamp, onClick }) => {
  return (
    <ContentContainer onClick={onClick}>
      <InformationContainer>
        <Avatar/>
        <TextContainer>
          <Name>{name}</Name>
          <Message>{message}</Message>
        </TextContainer>
      </InformationContainer>
      <Time>{timestamp}</Time>
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  ${'' /* background-color: ${theme.color.gray0}; */}
  padding: 10px;
  height: 60px;
  border-bottom: 2px solid ${theme.color.gray0};
`;

const InformationContainer = styled.div`
  display: flex;
  gap: 10%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;
`;

const Name = styled(Typography)`
  font-size: 18px;
`;

const Message = styled(Typography)`
  font-size: 14px;
  color: ${theme.color.gray2};
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
`;

const Time = styled(Typography)`
  font-size: 14px;
  color: ${theme.color.gray2};
`;

export default ChatHistoryPerUser;