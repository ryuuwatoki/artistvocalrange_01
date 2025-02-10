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
      console.error("更新名稱失敗:", error);
      setIsLoading(false);
    });
  }

  return(
    <>
      <Header size='small'>
        會員名稱
        <Button floated='right' onClick={handleOpenModal}>修改</Button>
      </Header>
      <Segment vertical >{user?.displayName || "無顯示名稱"}</Segment>
      <Modal size='mini' open={isModalOpen}>
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <Input
          fluid
          placeholder='輸入新的會員名稱' 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={()=> setIsModalOpen(false)}>取消</Button>
          <Button onClick={onSubmit} loading={isLoading} >修改</Button>
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
      alert("新密碼與確認密碼不一致");
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
            console.error("更新密碼失敗:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("身份驗證失敗:", error);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Header size='small'>
        會員密碼
        <Button floated='right' onClick={handleOpenModal}>
          修改
          </Button>
      </Header>
      <Segment vertical ></Segment>
      <Modal size='mini' open={isModalOpen}>
        <Modal.Header>修改密碼</Modal.Header>
        <Modal.Content>
          <Header>目前密碼</Header>
          <Input
          fluid
          placeholder='輸入舊密碼' 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)}
          type={isPasswordVisible ? 'text' : 'password'}
          />
          <Header>新密碼</Header>
          <Input
          fluid
          placeholder='輸入新密碼' 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          type={isPasswordVisible ? 'text' : 'password'}
          />
          <Header>確認密碼</Header>
          <Input
          fluid
          placeholder='確認新密碼'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={isPasswordVisible ? 'text' : 'password'}
          />

          <div style={{ marginTop: '10px' }}>
            <Input
              type="checkbox"
              label="顯示密碼"
              onChange={() => setIsPasswordVisible(!isPasswordVisible)}  // 切換顯示狀態
            />
          </div>


        </Modal.Content>
        <Modal.Actions>
          <Button onClick={()=> setIsModalOpen(false)}>取消</Button>
          <Button onClick={onSubmit} loading={isLoading} >修改</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

function MySettingsZh ({user}){

  return (
    <Container>

    <Grid>
  <Grid.Row>
    <Grid.Column width={2}></Grid.Column>

    <Grid.Column width={11}>
      <>
      <Header>會員資料</Header>
      <MyName user={user} />
      <MyPassword user={user} />
      <Button color='pink' as={Link} to='/zh/posts' style={{ marginTop: '5px' }} >返回</Button>
      </>

    </Grid.Column>

    <Grid.Column width={2}></Grid.Column>

  </Grid.Row>
</Grid>

    </Container>

  )
}

export default MySettingsZh;