import React from 'react';
import { Grid, Item, Container, Header,Button, Segment, Modal,Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getAuth, updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

function MyName({user}){
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setDisplayName('');  // 清空名稱欄位
  }

  function onSubmit() {
    setIsLoading(true);
    updateProfile(user, {
      displayName: displayName,
    })
    .then(()=>{
    setDisplayName('');
    setIsModalOpen(false);
    setIsLoading(false);
    })
    .catch((error) => {
      console.error("更新エラー:", error);
      setIsLoading(false);
    });
  }

  return(
    <>
      <Header size='small'>
        なまえ．ニックネーム
        <Button floated='right' onClick={handleOpenModal}>変更</Button>
      </Header>
      <Segment vertical >{user?.displayName || "未設定"}</Segment>
      <Modal size='mini' open={isModalOpen}>
        <Modal.Header>ユーザー名を編集する</Modal.Header>
        <Modal.Content>
          <Input
          style={{ fontSize: "12px" }}
          fluid
          placeholder='新しいユーザー名を入力してください' 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={()=> setIsModalOpen(false)}>キャンセル</Button>
          <Button onClick={onSubmit} loading={isLoading} >保存</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

function MyPassword({user}){
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setOldPassword('');  // 清空舊密碼欄位
    setNewPassword('');   // 清空新密碼欄位
    setConfirmPassword('');  // 清空確認密碼欄位
    setIsPasswordVisible(false); // 每次開啟時重設密碼為隱藏
  }

  function onSubmit() {
    if (newPassword !== confirmPassword) {
      alert("新しいパスワードと確認用パスワードが一致しません");
      return;
    }

    setIsLoading(true);
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(user.email, oldPassword); // 使用新的認證提供者

    reauthenticateWithCredential(auth.currentUser, credential) // 使用 auth.currentUser 進行重新驗證
      .then(() => {
        updatePassword(auth.currentUser, newPassword) // 使用 auth.currentUser 更新密碼
          .then(() => {
            setIsModalOpen(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("パスワードの更新に失敗しました:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("認証に失敗しました:", error);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Header size='small'>
        パスワード
        <Button floated='right' onClick={handleOpenModal}>
          変更
          </Button>
      </Header>
      <Segment vertical ></Segment>
      <Modal size='mini' open={isModalOpen}>
        <Modal.Header>パスワード変更</Modal.Header>
        <Modal.Content>
          <Header>現在のパスワード</Header>
          <Input
          fluid
          style={{ fontSize: "12px" }}
          placeholder='パスワードを入力してください' 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)}
          type={isPasswordVisible ? 'text' : 'password'}
          />
          <Header>新しいパスワード</Header>
          <Input
          fluid
          style={{ fontSize: "12px" }}
          placeholder='新しいパスワードを入力してください' 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          type={isPasswordVisible ? 'text' : 'password'}
          />
          <Header>新しいパスワード（確認用）</Header>
          <Input
          fluid
          style={{ fontSize: "12px" }}
          placeholder='新しいパスワードを入力してください'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={isPasswordVisible ? 'text' : 'password'}
          />

          <div style={{ marginTop: '10px' }}>
            <Input
              type="checkbox"
              style={{ fontSize: "9px" }}
              label="パスワードを表示する"
              onChange={() => setIsPasswordVisible(!isPasswordVisible)}  // 切換顯示狀態
            />
          </div>



        </Modal.Content>
        <Modal.Actions>
          <Button onClick={()=> setIsModalOpen(false)}>キャンセル</Button>
          <Button onClick={onSubmit} loading={isLoading} >保存</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

function MySettingsJp ({user}){

  return (
    <Container>

    <Grid>
  <Grid.Row>
    <Grid.Column width={2}></Grid.Column>

    <Grid.Column width={11}>
      <>
      <Header>会員情報</Header>
      <MyName user={user} />
      <MyPassword user={user} />
      <Button color='pink' as={Link} to='/jp/posts' style={{ marginTop: '5px' }} >戻る</Button>
      </>
    </Grid.Column>

    <Grid.Column width={2}></Grid.Column>

  </Grid.Row>
</Grid>

    </Container>

  )
}

export default MySettingsJp;