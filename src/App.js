import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation,useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';

import HeaderEn from "./pages/en/HeaderEn";
import SigninEn from "./pages/en/SigninEn";
import RegisterSuccessEn from "./pages/en/RegisterSuccessEn";
import PostsEn from "./pages/en/PostsEn";
import NewArtistEn from "./pages/en/NewArtistEn";
import PostEn from "./pages/en/PostEn";
import MySettingsEn from "./pages/en/MySettingsEn";
// import PostFastEn from "./pages/en/PostFastEn";
// import ListFastEn from "./pages/en/ListFastEn";

import HeaderZh from "./pages/zh/HeaderZh";
import SigninZh from "./pages/zh/SigninZh";
import RegisterSuccessZh from "./pages/zh/RegisterSuccessZh";
import PostsZh from "./pages/zh/PostsZh";
import NewArtistZh from "./pages/zh/NewArtistZh";
import PostZh from "./pages/zh/PostZh";
import MySettingsZh from "./pages/zh/MySettingsZh";

import HeaderJp from "./pages/jp/HeaderJp";
import SigninJp from "./pages/jp/SigninJp";
import RegisterSuccessJp from "./pages/jp/RegisterSuccessJp";
import PostsJp from "./pages/jp/PostsJp";
import NewArtistJp from "./pages/jp/NewArtistJp";
import PostJp from "./pages/jp/PostJp";
import MySettingsJp from "./pages/jp/MySettingsJp";

function App() {
  const [user, setUser] = useState(null); // 記錄當前用戶的狀態
  const location = useLocation(); // 獲取當前路徑
  const navigate = useNavigate();
  const language = location.pathname.split('/')[1]; // 從路徑中提取語言部分

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 設置用戶狀態
    });
    return () => authListener(); // 清除監聽
  }, []);

  useEffect(() => {
    if (!['en', 'zh', 'jp'].includes(language)) {
      navigate(`/en${location.pathname}`, { replace: true });
    } else if (location.pathname === `/${language}`) {
      // 如果當前語言只有 `/en`, `/zh`, `/jp`，則導向到 posts
      navigate(`/${language}/posts`, { replace: true });
    }
  }, [language, navigate, location.pathname]);

  // 根據語言顯示對應的 Header
  const renderHeader = () => {
    switch (language) {
      case 'en':
        return <HeaderEn user={user} />;
      case 'zh':
        return <HeaderZh user={user} />;
      case 'jp':
        return <HeaderJp user={user} />;
      default:
        return <HeaderEn user={user} />; // 默認為英文
    }
  };

  return (
    <>
      {renderHeader()}
      <Routes>
        <Route path="/" element={<Navigate to="/en/posts" />} />
        <Route path="/en" element={<Navigate to="/en/posts" />} />


        {/* English Routes */}
        <Route path="/en/posts" element={<PostsEn />} />
        <Route path="/en/signin" element={<SigninEn />} />
        <Route path="/en/registersuccess" element={<RegisterSuccessEn user={user} />} />
        <Route path="/en/new-artist" element={user ? <NewArtistEn /> : <Navigate to="/en/posts" />} />
        <Route path="/en/posts/:postId" element={<PostEn user={user} />} />
        <Route path="/en/mysettings" element={user ? <MySettingsEn user={user} /> : <Navigate to="/en/posts" />} />
        {/* <Route path="/en/posts/:postId/postfast" element={<PostFastEn user={user} />} />
        <Route path="/en/listfast" element={<ListFastEn user={user} />} /> */}

        {/* Chinese Routes */}
        <Route path="/zh/posts" element={<PostsZh />} />
        <Route path="/zh/signin" element={<SigninZh />} />
        <Route path="/zh/registersuccess" element={<RegisterSuccessZh />} />
        <Route path="/zh/new-artist" element={user ? <NewArtistZh /> : <Navigate to="/zh/posts" />} />
        <Route path="/zh/posts/:postId" element={<PostZh user={user} />} />
        <Route path="/zh/mysettings" element={user ? <MySettingsZh user={user} /> : <Navigate to="/zh/posts" />} />

        {/* Japanese Routes */}
        <Route path="/jp/posts" element={<PostsJp />} />
        <Route path="/jp/signin" element={<SigninJp />} />
        <Route path="/jp/registersuccess" element={<RegisterSuccessJp user={user} />} />
        <Route path="/jp/new-artist" element={user ? <NewArtistJp /> : <Navigate to="/jp/posts" />} />
        <Route path="/jp/posts/:postId" element={<PostJp user={user} />} />
        <Route path="/jp/mysettings" element={user ? <MySettingsJp user={user} /> : <Navigate to="/jp/posts" />} />
      </Routes>
    </>
  );
}

export default App;





// 2/7 15:00
// import React from 'react';
// import { BrowserRouter, Route,Routes, Navigate, useLocation } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from './utils/firebase';

// import HeaderEn from "./pages/en/HeaderEn";
// import SigninEn from "./pages/en/SigninEn";
// import RegisterSuccessEn from "./pages/en/RegisterSuccessEn";
// import PostsEn from "./pages/en/PostsEn";
// import NewArtistEn from "./pages/en/NewArtistEn";
// import PostEn from "./pages/en/PostEn";
// import MySettingsEn from "./pages/en/MySettingsEn";
// import PostFastEn from "./pages/en/PostFastEn";
// import ListFastEn from "./pages/en/ListFastEn";

// function App() {
//   const [user, setUser] = React.useState(null);
//   React.useEffect(() => {
//     const authListener = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => authListener();
//   }, []);

//   return (
//     <BrowserRouter>
//       <HeaderEn user={user} />
//       <Routes>
//         <Route path="/" element={<Navigate to="/en/posts" />} />
//         <Route path="/en/posts" element={<PostsEn />} />
//         <Route path="/en/signin" element={<SigninEn />} />
//         <Route path="/en/registersuccess" element={<RegisterSuccessEn user={user} />} />
//         <Route path="/en/new-artist" element={user ? <NewArtistEn /> : <Navigate to="/posts" />} />
//         <Route path="/en/posts/:postId" element={<PostEn user={user} />} />
//         <Route path="/en/mysettings" element={user ? <MySettingsEn user={user} /> : <Navigate to="/posts" />} />
//         <Route path="/en/posts/:postId/postfast" element={<PostFastEn user={user} />} />
//         <Route path="/en/listfast" element={<ListFastEn user={user} />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
// export default App;





// import React from 'react';
// import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from './utils/firebase';


// import Header from "./Header";
// import Signin from "./pages/signin";
// import RegisterSuccess from "./pages/registersuccess";
// import Posts from "./pages/Posts";
// import NewArtist from "./pages/NewArtist";
// import Post from "./pages/Post";
// import MySettings from "./pages/MySettings";
// import PostFast from "./pages/PostFast";
// import ListFast from "./pages/ListFast";




// function App () {
//   const [user, setUser] = React.useState(null);
//   React.useEffect(() => {
//     const authListener = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => authListener(); // 清除監聽，避免 memory leak
//   }, []);



//   return (
//     <BrowserRouter>

        

//         <Header user={user}/>

//         <Switch>
//           <Route path='/posts' exact>
//             <Posts />
//           </Route>

//           <Route path='/signin' exact>
//           {user ? <Redirect to='posts'/>
//           : <Signin /> }
//           </Route>
          

//           <Route path='/registersuccess' exact>
//           {user ? <Redirect to='posts'/>
//           : <RegisterSuccess />}
//           </Route>

//           <Route path='/new-artist' exact>
//           {user ? <NewArtist />
//           : <Redirect to='posts'/> }
//           </Route>

//           <Route path='/posts/:postId' exact>
//             <Post user={user}/>
//           </Route>

//           <Route path='/mysettings' exact>
//           {user ? <MySettings user={user} />
//           : <Redirect to='posts'/> }
//           </Route>

//           <Route path='/posts/:postId/postfast' exact>
//             <PostFast user={user}/>
//           </Route>

//           <Route path='/listfast' exact>
//             <ListFast user={user}/>
//           </Route>



//         </Switch>



//     </BrowserRouter>
//   );
// }

// export default App;