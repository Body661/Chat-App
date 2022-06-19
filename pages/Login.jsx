import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInHandler = () => {
    auth.signInWithPopup(provider).catch(console.error);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginButton
        onClick={signInHandler}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Google /> Sign in with google
      </LoginButton>
    </Container>
  );
};

export default Login;

const Container = styled.div``;

const LoginButton = styled(Button)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  font-size: 20px;
`;
