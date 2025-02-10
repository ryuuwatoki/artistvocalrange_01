import React from 'react';
import { Grid, Item,Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import { db } from "../../utils/firebase";
import { collection, getDocs, query, orderBy, limit, startAfter, } from "firebase/firestore";


function PostsZh(){
  const [posts, setPosts] = React.useState([]);
  const [songCounts, setSongCounts] = React.useState({});
  const [lastVisible, setLastVisible] = React.useState(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postQuery = query(collection(db, "posts"), orderBy("title"), limit(40));
        const querySnapshot = await getDocs(postQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(data); //查data用
        setPosts(data); // 設定 posts
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // 記錄最後一篇文章
        // 查詢每篇 post 的歌曲數量
        const fetchSongCounts = data.map(async (post) => {
          const songQuery = query(
            collection(db, "posts", post.id, "songDatas"),
            orderBy("songName", "desc"),
          );
          const songSnapshot = await getDocs(songQuery);
          return { postId: post.id, count: songSnapshot.size };
        });
        // 等待所有歌曲數量查詢完成
        const counts = await Promise.all(fetchSongCounts);
        const countMap = counts.reduce((acc, { postId, count }) => {
          acc[postId] = count;
          return acc;
        }, {});

        setSongCounts(countMap);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);


  const loadMorePosts = async () => {
    if (lastVisible) {
      try {
        const postQuery = query(
          collection(db, "posts"),
          orderBy("title"),
          startAfter(lastVisible), // 從最後一篇文章後繼續抓取
          limit(40)
        );
        const querySnapshot = await getDocs(postQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts((prevPosts) => [...prevPosts, ...data]); // 追加資料
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // 更新最後一篇文章
      } catch (error) {
        console.error("Error fetching more posts: ", error);
      }
    }
  };


  return (
<Container>
<Grid>
<Grid.Row>
    <Grid.Column width={2}></Grid.Column>

    <Grid.Column width={7}>
      <>

      <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header style={{ fontSize: '22px', paddingBottom: '10px' , paddingTop: '10px' }}>
            藝術家 列表</Item.Header>
          </Item.Content>
        </Item>

        {posts.map((post) => (
          <Item key={post.id} as={Link} to={`/zh/posts/${post.id}`} >
            <Item.Content >
              <Item.Header
              style={{ fontSize: '13px', paddingTop: '10px' }} >
                {post.title}</Item.Header>
                
              <Item.Extra 
              style={{ fontSize: '10px' }}
              >&nbsp;&nbsp;&nbsp;{songCounts[post.id] || 0} 曲</Item.Extra>
            </Item.Content>
          </Item>
        ))}

      </Item.Group>

      <Waypoint 
      onEnter={() => {
      loadMorePosts(); }} />

      </>
      
    </Grid.Column>

    <Grid.Column width={2}></Grid.Column>

</Grid.Row>
</Grid>
</Container>

  )
}

export default PostsZh;