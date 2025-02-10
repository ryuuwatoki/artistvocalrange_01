import React from "react";
import { Container, Button, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";  // 使用 useNavigate 代替 useHistory

function RegisterSuccessJp() {
  const navigate = useNavigate();  // 使用 useNavigate

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <Message success>
        <Message.Header>登録が完了しました！</Message.Header>
        <p>アカウントの登録が成功しました、今すぐログインできます。</p>
      </Message>

      <Button color="blue" onClick={() => navigate('/jp/posts')}> 
        ホームに戻る
      </Button>
    </Container>
  );
}

export default RegisterSuccessJp;
