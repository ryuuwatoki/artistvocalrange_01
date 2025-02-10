import React from "react";
import { Container, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";  // 使用 useNavigate 代替 useHistory

function RegisterSuccessZh() {
  const navigate = useNavigate();  // 使用 useNavigate

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <Message success>
        <Message.Header>註冊成功!</Message.Header>
        <p>您已成功註冊帳號。現在您可以進行登入。</p>
      </Message>

      <Button color="blue" onClick={() => navigate('/zh/posts')}> 
        回首頁
      </Button>
    </Container>
  );
}

export default RegisterSuccessZh;
