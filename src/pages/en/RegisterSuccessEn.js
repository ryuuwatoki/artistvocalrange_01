import React from "react";
import { Container, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";  // 使用 useNavigate 代替 useHistory

function RegisterSuccessEn() {
  const navigate = useNavigate();  // 使用 useNavigate

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <Message success>
        <Message.Header>Registration Successful!</Message.Header>
        <p>You have successfully registered your account.</p>
      </Message>

      <Button color="blue" onClick={() => navigate('/en/posts')}
        >
        Back to Home
      </Button>
    </Container>
  );
}

export default RegisterSuccessEn;
