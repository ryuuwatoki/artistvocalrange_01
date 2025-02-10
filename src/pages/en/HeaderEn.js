import { auth, db } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { Menu, Dropdown, Search, Icon, Button, Container } from 'semantic-ui-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function HeaderEn({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
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
    if (!value) {
      setSearchResults([]);
      return;
    }
    const filteredResults = posts.flatMap(post => {
      const titleMatch = post.title.toLowerCase().includes(value.toLowerCase())
        ? [{ title: post.title, id: post.id }]
        : [];
      const songMatches = post.songs
        .filter(song => song.toLowerCase().includes(value.toLowerCase()))
        .map(song => ({ title: `${post.title} - ${song}`, id: `${post.id}-${song}` }));
      return [...titleMatch, ...songMatches];
    });
    setSearchResults(filteredResults);
  };

  const handleResultSelect = (e, { result }) => {
    const postId = result.id.split('-')[0];
    navigate(`/en/posts/${postId}`);
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

        <Menu.Item as={Link} to='/en/posts'>
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
          <Menu.Item as={Link} to='/en/signin' style={{ fontSize: "14px" }}>
            <Button primary style={{ width: 75, fontSize: '9px' }}>
              Sign In
            </Button>
          </Menu.Item>
        </Container>
      )}

      {user && (
        <Container style={{ padding: '0px 0px 15px 0px', width: '95%', display: 'flex', justifyContent: 'flex-end' }}>
          {location.pathname === '/en/posts' && (
            <Menu.Item>
              <Button style={{ width: 75, fontSize: '9px' }} as={Link} to="/en/new-artist">
                Add Artist
              </Button>
            </Menu.Item>
          )}

          <Menu.Item>
            <Button color='violet' style={{ width: 75, fontSize: '9px' }} as={Link} to="/en/mysettings">
              Account
            </Button>
          </Menu.Item>

          <Menu.Item>
            <Button color='pink' style={{ width: 75, fontSize: '9px' }} 
              onClick={() => {
                signOut(auth);
                navigate('/en/posts');
              }}>
              Sign Out
            </Button>
          </Menu.Item>
        </Container>
      )}
    </>
  );
}

export default HeaderEn;
