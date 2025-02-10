import React from "react";
import { Container, Header, Form, Modal, Button } from "semantic-ui-react";
import { db } from "../../utils/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function NewArtistEn() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);  // Control Modal visibility
  
  async function onSubmit() {
    if (!title.trim()) {
      setOpen(true);  // Show Modal alert
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth(); // Get current user
      const user = auth.currentUser;
      
      if (!user) {
        console.error("No authenticated user");
        return;
      }

      // Add data to Firebase
      await addDoc(collection(db, "posts"), {
        title,
        createdAt: serverTimestamp(),
        author: {
          displayName: user.displayName || '',
          uid: user.uid,
          email: user.email,
        }
      });

      // Update state to re-render the page without refreshing
      setTitle('');  // Clear input field
      setIsLoading(false);
      navigate('/en/posts');  // Navigate to another page
    } catch (error) {
      console.error("Error adding document:", error);
      setIsLoading(false);  // End loading state on error
    }
  }

  return (
    <Container>
      <Header>Add Artist</Header>
      <Form onSubmit={onSubmit}>
        <Form.Input
          placeholder="Enter name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: 15 }}>
          <Form.Button
            color="teal"
            loading={isLoading}
            style={{
              marginVertical: 15, width: 50,
              fontSize: '10px',
            }}
          >
            Add
          </Form.Button>

          <Form.Button
            onClick={() => navigate('/en/posts')}
            style={{
              marginVertical: 15, width: 50,
              fontSize: '10px',
            }}
          >
            Back
          </Form.Button>
        </div>
      </Form>

      {/* Modal alert */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Warning</Modal.Header>
        <Modal.Content>
          <p>Content is empty</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}

export default NewArtistEn;
