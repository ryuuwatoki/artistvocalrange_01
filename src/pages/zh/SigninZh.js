import React from "react";
import { Menu, Form, Container, Checkbox, Message } from "semantic-ui-react";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";  // 使用 useNavigate 代替 useHistory
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function SigninZh() {
  const [activeItem, setActiveItem] = React.useState('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState(''); 
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();  // 使用 useNavigate
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
  }, []);


  function onSubmit() {
    setIsLoading(true);
    if (activeItem === 'register') {
      if (password !== confirmPassword) { // 檢查密碼是否一致
        setErrorMessage('密碼與確認密碼不一致');
        setIsLoading(false);
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)

      .then(() => auth.signOut()) // 立即登出

      .then(() => { 
        if (isMounted.current) {
          setIsLoading(false);
          navigate('/zh/registersuccess');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (isMounted.current) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setErrorMessage('信箱已存在');
              break;
            case 'auth/invalid-email':
              setErrorMessage('信箱格式不正確');
              break;
            case 'auth/weak-password':
              setErrorMessage('密碼強度不足');
              break;
            default:
              setErrorMessage('發生錯誤，請稍後再試');
          }
          setIsLoading(false);
        }
      });

    } else if (activeItem === 'signin') {

      signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (isMounted.current) {
          navigate('/zh/posts');  // 使用 navigate 代替 history.push
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (isMounted.current) {
          switch (error.code) {
            case 'auth/invalid-email':
              setErrorMessage('信箱格式不正確');
              break;
            case 'auth/invalid-credential':
              setErrorMessage('信箱或密碼錯誤');
              break;
            default:
              setErrorMessage('發生錯誤，請稍後再試');
          }
          setIsLoading(false);
        }
      });

    }
  }

  return (
    <Container>
      <Menu widths='2' color="blue">
        <Menu.Item active={activeItem === 'signin'} onClick={() => {
          setErrorMessage('')
          setActiveItem('signin')}}>
          登入
        </Menu.Item>
          
        <Menu.Item active={activeItem === 'register'} onClick={() => {
          setErrorMessage('')
          setActiveItem('register')}}>
          註冊
        </Menu.Item>
      </Menu>

      <Form onSubmit={onSubmit}>
        <Form.Input label='信箱' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='請輸入信箱' />
        <Form.Input label='密碼' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='請輸入密碼' />
        {activeItem === 'register' && (
          <Form.Input 
            label='確認密碼' 
            type={showPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder='請確認密碼' 
          />
        )}
        <Form.Field>
          <Checkbox label='顯示密碼' checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
        </Form.Field>
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Form.Button loading={isLoading}>
          {activeItem === 'signin' && '登入'}
          {activeItem === 'register' && '註冊'}
        </Form.Button>
      </Form>
    </Container>
  );
}

export default SigninZh;
