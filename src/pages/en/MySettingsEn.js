import React from 'react';
import { Grid, Item, Container, Header, Button, Segment, Modal, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getAuth, updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

function MyName({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [displayName, setDisplayName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setDisplayName(''); // Clear name field
  }

  function onSubmit() {
    setIsLoading(true);

    updateProfile(user, {
      displayName: displayName,
    })
    .then(() => {
      setDisplayName('');
      setIsModalOpen(false);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Failed to update name:", error);
      setIsLoading(false);
    });
  }

  return (
    <>
      <Header size='small'>
        Username
        <Button floated='right' onClick={handleOpenModal}>Edit</Button>
      </Header>
      <Segment vertical>{user?.displayName || "Unnamed"}</Segment>
      <Modal size='mini' open={isModalOpen}>
        <Modal.Header>Edit Username</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            placeholder='Enter new username' 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={onSubmit} loading={isLoading}>Save</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

function MyPassword({ user }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setOldPassword(''); // Clear old password field
    setNewPassword(''); // Clear new password field
    setConfirmPassword(''); // Clear confirm password field
    setIsPasswordVisible(false); // Reset password visibility on open
  }

  function onSubmit() {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setIsLoading(true);
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(user.email, oldPassword); // Use new authentication provider

    reauthenticateWithCredential(auth.currentUser, credential) // Reauthenticate using auth.currentUser
      .then(() => {
        updatePassword(auth.currentUser, newPassword) // Update password using auth.currentUser
          .then(() => {
            setIsModalOpen(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Failed to update password:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Failed to authenticate:", error);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Header size='small'>
        Password
        <Button floated='right' onClick={handleOpenModal}>Edit</Button>
      </Header>
      <Segment vertical></Segment>
      <Modal size='mini' open={isModalOpen}>
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Content>
          <Header>Current Password</Header>
          <Input
            fluid
            placeholder='Enter old password' 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)}
            type={isPasswordVisible ? 'text' : 'password'}
          />
          <Header>New Password</Header>
          <Input
            fluid
            placeholder='Enter new password' 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            type={isPasswordVisible ? 'text' : 'password'}
          />
          <Header>Confirm Password</Header>
          <Input
            fluid
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={isPasswordVisible ? 'text' : 'password'}
          />

          <div style={{ marginTop: '10px' }}>
            <Input
              type="checkbox"
              label="Show password"
              onChange={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
            />
          </div>

        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={onSubmit} loading={isLoading}>Save</Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

function MySettingsEn({ user }) {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}></Grid.Column>

          <Grid.Column width={11}>
            <>
              <Header>Profile</Header>
              <MyName user={user} />
              <MyPassword user={user} />
              <Button color='pink' as={Link} to='/en/posts' style={{ marginTop: '5px' }}>Back</Button>
            </>
          </Grid.Column>

          <Grid.Column width={2}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default MySettingsEn;
