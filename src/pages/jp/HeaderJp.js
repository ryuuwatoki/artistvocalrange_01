import { auth, db } from '../../utils/firebase'; // 使用具名匯入 auth
import { signOut } from 'firebase/auth';
import { Menu, Dropdown, Search, Icon, Button, Container, Grid } from 'semantic-ui-react';
import { Link, useLocation, useNavigate, } from 'react-router-dom'; // 引入 useLocation
import React, { useRef, useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';


function HeaderJp({ user }) {
  const location = useLocation();
  const navigate = useNavigate(); // 改用 useNavigate 來取代 useHistory
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postQuery = query(collection(db, "posts"), orderBy("title"));
      const querySnapshot = await getDocs(postQuery);
      const postData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const songQuery = collection(db, "posts", doc.id, "songDatas");
        const songSnapshot = await getDocs(songQuery);
        const songNames = songSnapshot.docs.map(songDoc => songDoc.data().songName);
        return {
          id: doc.id,
          title: doc.data().title,
          songs: songNames
        };
      }));
      setPosts(postData);
    };
    fetchPosts();
  }, []);

  const handleSearchChange = (e, { value }) => {
    setSearchQuery(value);
    if (value.length === 0) {
      setSearchResults([]);
      return;
    }
    const filteredResults = posts.flatMap(post => {
      const titleMatch = post.title.toLowerCase().includes(value.toLowerCase()) 
        ? [{ title: post.title, id: post.id }] 
        : [];
      const songMatches = post.songs
        .filter(song => song.toLowerCase().includes(value.toLowerCase()))
        .map(song => ({ title: `${post.title} - ${song}`, id: `${post.id}-${song}` })); // 也是使用 `id`
      return [...titleMatch, ...songMatches];
    });
    setSearchResults(filteredResults);
  };

  const handleResultSelect = (e, { result }) => {
    const postId = result.id.split('-')[0];
    navigate(`/jp/posts/${postId}`); // 改用 navigate
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Menu>
        <Dropdown
          item
          trigger={<Icon name="globe" size="large" />}
          icon={null}
          options={[
            { key: 'en', value: 'en', text: 'English' },
            { key: 'zh', value: 'zh', text: '繁體中文' },
            { key: 'jp', value: 'jp', text: '日本語' },
          ]}
          onChange={(e, { value }) => {
            if (value === 'en') {
              navigate('/en/posts');
            } else if (value === 'zh') {
              navigate('/zh/posts');
            } else if (value === 'jp') {
              navigate('/jp/posts');
            }
          }}
        />

        <Menu.Item as={Link} to='/jp/posts'>
          AVRWIKI<Icon name='home' />
        </Menu.Item>

        <div ref={searchRef} style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <Search
            placeholder='Search...'
            value={searchQuery}
            onSearchChange={handleSearchChange}
            results={searchResults}
            onResultSelect={handleResultSelect}
          />
        </div>

      </Menu>

      {!user && (
        <Container style={{ padding: '0px 0px 15px 0px', width: '95%', display: 'flex', justifyContent: 'flex-end' }}>
          <Menu.Item as={Link} to='/jp/signin' style={{ fontSize: "14px" }}>
              <Button primary style={{ marginVertical: 30, width: 75, fontSize: '9px' }}>
                ログイン
              </Button>
            </Menu.Item>          
        </Container>
        )}

      {user && (
        <Container style={{ padding: '0px 0px 15px 0px', width: '95%', display: 'flex', justifyContent: 'flex-end' }}>
          {location.pathname === '/jp/posts' && (
            <Menu.Item>
              <Button style={{ marginVertical: 30, width: 100, fontSize: '9px' }} as={Link} to="/jp/new-artist">
              アーティスト追加
              </Button>
            </Menu.Item>
          )}

          <Menu.Item >
            <Button color='violet' style={{ marginVertical: 30, width: 75, fontSize: '9px' }} as={Link} to="/jp/mysettings">
              アカウント
            </Button>
          </Menu.Item>

          <Menu.Item >
            <Button color='pink' style={{ marginVertical: 30, width: 75, fontSize: '9px' }} 
            onClick={() => { signOut(auth); 
            navigate('/jp/posts'); 
            }}>
              ログアウト
            </Button>
          </Menu.Item>
        </Container>
      )}
    </>
  );
}

export default HeaderJp;