import React from 'react';
import { Grid, Item, Container, Header,Comment, Form,Button, Menu, Modal, Table, } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { db } from "../../utils/firebase"; 
import { deleteDoc, collection, getDoc, doc, addDoc, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore";
import { getAuth } from "firebase/auth";



function PostJp({user}) {
  const {postId} = useParams();
  const [post, setPost] = React.useState({author:{} });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormVisible, setIsFormVisible] = React.useState(false); 
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [songDatas, setSongDatas] = React.useState([]);
  const [songName, setSongName] = React.useState('');
  const [hiNote, setHiNote] = React.useState('');
  const [hiNoteSharp, setHiNoteSharp] = React.useState('');
  const [hiNoteOctave, setHiNoteOctave] = React.useState('');
  const [lowNote, setLowNote] = React.useState('');
  const [lowNoteSharp, setLowNoteSharp] = React.useState('');
  const [lowNoteOctave, setLowNoteOctave] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = async (songId) => {
    const auth = getAuth();
    if (!auth.currentUser) {
      alert("ログインしてください");
      return;
    }
    try {
      await deleteDoc(doc(db, `posts/${postId}/songDatas/${songId}`));
      alert("削除成功！");
    } catch (error) {
      console.error("削除失敗", error);
      alert("削除に失敗しました。後で再試行してください");
    }
  };

  const noteOptions = [
    { key: 'C', value: 'C', text: 'C' },
    { key: 'D', value: 'D', text: 'D' },
    { key: 'E', value: 'E', text: 'E' },
    { key: 'F', value: 'F', text: 'F' },
    { key: 'G', value: 'G', text: 'G' },
    { key: 'A', value: 'A', text: 'A' },
    { key: 'B', value: 'B', text: 'B' },
  ];
  const sharpOptions = [
    { key: '', value: '', text: '原音' },
    { key: 'b', value: 'b', text: 'b' },
    { key: '#', value: '#', text: '#' }
  ];
  const octaveOptions = [
    { key: '0', value: '0', text: '0' },
    { key: '1', value: '1', text: '1' },
    { key: '2', value: '2', text: '2' },
    { key: '3', value: '3', text: '3' },
    { key: '4', value: '4', text: '4' },
    { key: '5', value: '5', text: '5' },
    { key: '6', value: '6', text: '6' },
    { key: '7', value: '7', text: '7' },
    { key: '8', value: '8', text: '8' },
    { key: '9', value: '9', text: '9' },
  ];
  const defaultNote = noteOptions[0]?.value || 'C';
  const defaultSharpOption = sharpOptions[0]?.value || '';
  const defaultOctaveOption = octaveOptions[4]?.value || '4';

  React.useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, "posts", postId);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchPost();
  }, [postId]);

  // 獲取歌曲資料
  React.useEffect(() => {
    const songList = onSnapshot(
      query(
      collection(db, 'posts', postId, 'songDatas'),
      orderBy("songName", )),
      (collectionSnapshot) => {
        const data = collectionSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // console.log(data);
        setSongDatas(data);
      }
    );
    return songList;
  }, [postId]
  );

  // 提交新歌曲資料
  const onSubmit = async () => {
    if (!songName.trim()) { // 檢查是否為空
      handleOpenModal();
      return;
    }

    setIsLoading(true);

    const auth = getAuth();
    if (!auth.currentUser) {
      alert("ログインしてください");
      return;}

    // 組合 note, sharp 和 octave
    const hiNoteValue = `${hiNote || defaultNote}${hiNoteSharp || defaultSharpOption}${hiNoteOctave || defaultOctaveOption}`;
    const lowNoteValue = `${lowNote || defaultNote}${lowNoteSharp || defaultSharpOption}${lowNoteOctave || defaultOctaveOption}`;

    // 增加資料
    const songDataRef = collection(db, `posts/${postId}/songDatas`);
    await addDoc(songDataRef, {
      songId: crypto.randomUUID(),
      songName: songName,
      hiNote: hiNoteValue,
      lowNote: lowNoteValue,
      createdAt: serverTimestamp(),
      author: {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || '',
      }});

    // //清空輸入框
    setSongName('');
    setHiNote('');
    setHiNoteSharp('');
    setHiNoteOctave('');
    setLowNote('');
    setLowNoteSharp('');
    setLowNoteOctave('');
    setIsLoading(false);
  };

  return (

  <>
  <Container>
  <Grid>
  <Grid.Row>

    <Grid.Column width={2}></Grid.Column>

    <Grid.Column width={13}>
      <Comment.Group>

        <Menu.Item>
          {user && (
          <Button
            style={{ marginVertical: 25, width: 100, fontSize: '12px', }} 
            onClick={() => setIsFormVisible(!isFormVisible)}
            >
            {isFormVisible ? "閉じる" : "曲目を追加"}
          </Button>
          )}

          <Header></Header>


        </Menu.Item>
        
                {isFormVisible && (
                <Form style={{ fontSize: '0.8em' }}>

                  <Header>曲名</Header>
                  <Form.Input
                  style={{ width: '90%' }}
                  value={songName} 
                  onChange={(e) => setSongName(e.target.value)} 
                  placeholder="曲名を入力してください"/>

                  <Header>最高音</Header>
                  <Form.Group>
                    <Form.Select 
                    options={noteOptions} 
                    value={hiNote || defaultNote} 
                    onChange={(e, { value }) => setHiNote(value)}
                    style={{minWidth: '60px',}}
                    />
                    <Form.Select 
                    options={sharpOptions} 
                    value={hiNoteSharp || defaultSharpOption} 
                    onChange={(e, { value }) => setHiNoteSharp(value)}
                    style={{minWidth: '100px',}}
                    />
                    <Form.Select 
                    options={octaveOptions} 
                    value={hiNoteOctave || defaultOctaveOption} 
                    onChange={(e, { value }) => setHiNoteOctave(value)}
                    style={{minWidth: '60px',}}
                    />
                  </Form.Group>

                  <Header>最低音</Header>
                  <Form.Group>
                    <Form.Select 
                    options={noteOptions} 
                    value={lowNote || defaultNote} 
                    onChange={(e, { value }) => setLowNote(value)}
                    style={{minWidth: '60px',}}
                    />
                    <Form.Select 
                    options={sharpOptions} 
                    value={lowNoteSharp || defaultSharpOption} 
                    onChange={(e, { value }) => setLowNoteSharp(value)}
                    style={{minWidth: '100px',}} 
                    />
                    <Form.Select 
                    options={octaveOptions} 
                    value={lowNoteOctave || defaultOctaveOption} 
                    onChange={(e, { value }) => setLowNoteOctave(value)}
                    style={{minWidth: '60px',}}
                    />
                  </Form.Group>

                  <Form.Button 
                  color='teal' 
                  style={{ margin: "5px 0", width: 60, fontSize: '12px' }} 
                  onClick={onSubmit} loading={isLoading}>
                  保存
                  </Form.Button>

                </Form>
                )}

    <Modal open={isModalOpen} onClose={handleCloseModal} size="tiny">
    <Modal.Header>Warning</Modal.Header>
    <Modal.Content>
    <p>曲名は空白にできません。曲名を入力してください。</p>
    </Modal.Content>
    <Modal.Actions>
    <Button onClick={handleCloseModal}>
      戻る
    </Button>
    </Modal.Actions>
    </Modal>


        <Header>
        アーティスト名: &nbsp;&nbsp; {post.title} <br />
        曲数:&nbsp;{songDatas.length}
        </Header>


<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell style={{minWidth: '1px', fontSize: '1.1em',fontWeight: 'bold' }}>
        {isMobile ? (
        <div dangerouslySetInnerHTML={{ __html: 'タイトル<br>最低音<br>最高音' }} />
        ) : ('タイトル')}
        </Table.HeaderCell>

      <Table.HeaderCell style={{minWidth: '1px', fontSize: '0.9em',fontWeight: 'bold' }}>{isMobile ? '' : '最低音'}</Table.HeaderCell>
      <Table.HeaderCell style={{minWidth: '1px', fontSize: '0.9em',fontWeight: 'bold' }}>{isMobile ? '' : '最高音'}</Table.HeaderCell>
      <Table.HeaderCell style={{minWidth: '1px', fontSize: '0.9em',fontWeight: 'bold' }}>{isMobile ? '' : 'creator'}</Table.HeaderCell>
      <Table.HeaderCell style={{minWidth: '1px'}}></Table.HeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    {songDatas.map((songDatas) => {
      return (
        <Table.Row key={songDatas.id}>
          <Table.Cell style={{ minWidth: '1px', fontSize: '0.9em',fontWeight: 'bold' }}>{songDatas.songName}</Table.Cell>
          <Table.Cell style={{ minWidth: '1px', fontSize: '0.8em' }}>{isMobile ? 'LowNote: ' : ''}{songDatas.lowNote}</Table.Cell>
          <Table.Cell style={{ minWidth: '1px', fontSize: '0.8em' }}>{isMobile ? 'HiNote: ' : ''}{songDatas.hiNote}</Table.Cell>

          <Table.Cell style={{ minWidth: '1px', fontSize: '0.7em' }}>
          {isMobile ? 'createdBy:' : 'by:'} {songDatas.author.displayName || 'newUser'}
          </Table.Cell>


          
          <Table.Cell  >
            {user?.uid === songDatas.author.uid && (
              <Button
              style={{ minWidth: '1px', fontSize: '0.7em' }}
              color="red" size="mini" 
              onClick={() => handleDelete(songDatas.id)}
              >
              削除
              </Button>
            )}
          </Table.Cell>
          
        </Table.Row>
      );
    })}
  </Table.Body>
</Table>



      </Comment.Group>
    </Grid.Column>

    <Grid.Column width={1}></Grid.Column>

  </Grid.Row>
  </Grid>
  </Container>
  </>
  )
}

export default PostJp;