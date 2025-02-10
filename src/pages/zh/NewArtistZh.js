import React from "react";
import { Container, Header, Form, Modal, Button } from "semantic-ui-react";
import { db } from "../../utils/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

// Container可以讓字不碰牆 留白效果

function NewArtistZh() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);  // 控制 Modal 顯示
  
  async function onSubmit() {
    if (!title.trim()) {
      setOpen(true);  // 顯示 Modal 提示
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth(); // 獲取當前使用者
      const user = auth.currentUser;
      
      if (!user) {
        console.error("No authenticated user");
        return;
      }

      // 新增資料到 Firebase
      await addDoc(collection(db, "posts"), {
        title,
        createdAt: serverTimestamp(),
        author: {
          displayName: user.displayName || '',
          uid: user.uid,
          email: user.email,
        }
      });

      // 更新狀態讓畫面重新渲染，無需重新整理頁面
      setTitle('');  // 清空輸入框
      setIsLoading(false);
      navigate('/zh/posts');  // 跳轉到另一個頁面
    } catch (error) {
      console.error("Error adding document:", error);
      setIsLoading(false);  // 在錯誤時結束載入狀態
    }
  }

  return (
    <Container>
      <Header>新增Artist名稱</Header>
      <Form onSubmit={onSubmit}>
        <Form.Input
          placeholder="請輸入名稱"
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
            新增
          </Form.Button>

          <Form.Button
            onClick={() => navigate('/zh/posts')}
            style={{
              marginVertical: 15, width: 50,
              fontSize: '10px',
            }}
          >
            返回
          </Form.Button>
        </div>
      </Form>

      {/* Modal 提示 */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>警告</Modal.Header>
        <Modal.Content>
          <p>內文空白</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>關閉</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}

export default NewArtistZh;
