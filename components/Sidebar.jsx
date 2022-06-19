import { Avatar, Button, IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import * as EmailValidator from "email-validator";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatIcon from "@mui/icons-material/Chat";
import { AddComment, Logout, SearchOutlined } from "@mui/icons-material";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

const Sidebar = () => {
  const emailInputRef = useRef();
  const [user] = useAuthState(auth);
  const [newChat, setNewChat] = useState(false);
  const [menu, setMenu] = useState(false);

  const userChatsRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatSnapshot] = useCollection(userChatsRef);

  const startChatHandler = () => {
    setNewChat((prevstate) => !prevstate);
  };

  const submitFormHandler = (e) => {
    e.preventDefault();

    if (!emailInputRef.current.value) {
      return;
    }

    if (
      EmailValidator.validate(emailInputRef.current.value) &&
      emailInputRef.current.value !== user.email &&
      !chatAlreadyExist(emailInputRef.current.value)
    ) {
      db.collection("chats").add({
        users: [user.email, emailInputRef.current.value],
      });
    }
  };

  const chatAlreadyExist = (recipientEmail) => {
    return chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} />
        <IconsContainer>
          <IconButton onClick={() => setMenu((prevstate) => !prevstate)}>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>

        {menu && (
          <LogoutButton
            style={{
              position: "absolute",
              right: "1rem",
              zIndex: "2",
              top: "100%",
              backgroundColor: "whitesmoke",
              padding: "10px",
              boxShadow: "2px 2px 4px gray",
            }}
            onClick={() => auth.signOut()}
          >
            <Logout /> Logout
          </LogoutButton>
        )}
      </Header>
      <Search>
        <SearchOutlined />
        <SearchInput placeholder="Search" />
      </Search>

      <SidebarButton onClick={startChatHandler}>
        <AddComment /> new chat
      </SidebarButton>

      {newChat && (
        <NewChatForm onSubmit={submitFormHandler}>
          <NewChatInput
            type="email"
            placeholder="Enter email"
            name="email"
            ref={emailInputRef}
          />
          <FormButton type="submit"> Add chat </FormButton>
        </NewChatForm>
      )}

      {chatSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  /* border-right: 0.5px solid whitesmoke; */
  height: 100vh;
  min-width: 300px;
  max-width: 400px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 2px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 5px;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

//? Email form
const NewChatForm = styled.form`
  display: flex;
  justify-content: center;
`;

const NewChatInput = styled.input`
  outline-width: 0;
  flex: 1;
  border: none;
  padding: 20px;

  &&& {
    border-bottom: 1px solid whitesmoke;
  }
`;

const FormButton = styled(Button)``;

const LogoutButton = styled(Button)`
  display: flex;
  gap: 5px;
`;
