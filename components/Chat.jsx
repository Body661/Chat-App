import { Avatar } from "@mui/material";
import React from "react";
import styled from "styled-components";
import getEmail from "../utils/getEmail";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

const Chat = (props) => {
  const [user] = useAuthState(auth);
  const email = getEmail(props.users, user);
  const router = useRouter();

  const enteredChat = () => {
    router.push(`/chat/${props.id}`);
  };

  const [chatSnapshot] = useCollection(
    db.collection("users").where("email", "==", getEmail(props.users, user))
  );

  const reciepient = chatSnapshot?.docs?.[0]?.data();

  return (
    <Container onClick={enteredChat}>
      {reciepient ? (
        <UserAvatar src={reciepient?.photoURL} />
      ) : (
        <UserAvatar>{email[0]}</UserAvatar>
      )}
      <p>{email}</p>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
