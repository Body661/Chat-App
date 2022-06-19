import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@mui/material";
import getEmail from "../utils/getEmail";
import { ArrowBack, AttachFile, MoreVert, Send } from "@mui/icons-material";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import firebase from "firebase";
import TimeAgo from "timeago-react";

const ChatScreen = (props) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState();
  const router = useRouter();
  const EndOfMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getEmail(props.chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(props.messages).map((message) => (
        <Message
          key={message.id}
          user={message.user}
          message={message.message}
        />
      ));
    }
  };

  const scrollToBottom = () => {
    EndOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMassage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.chatId).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        <BackIcon>
          <IconButton onClick={() => router.push("/")}>
            <ArrowBack style={{ color: "#B1B3B5" }} />
          </IconButton>
        </BackIcon>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{getEmail(props.chat.users, user)[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{getEmail(props.chat.users, user)}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}{" "}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </HeaderInfo>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={EndOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <IconButton disabled={!input} type="submit" onClick={sendMassage}>
          <Send />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 200;
  top: 0;
  display: flex;
  padding: 11px;
  align-items: center;
  border-bottom: 2px solid whitesmoke;
  height: 80px;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  > h3 {
    margin-bottom: 3px;
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1000;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin: 0 15px 0 0;
`;

const BackIcon = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;
