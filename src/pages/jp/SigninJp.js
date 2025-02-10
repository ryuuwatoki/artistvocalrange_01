import React from "react";
import { Menu, Form, Container, Checkbox, Message } from "semantic-ui-react";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";  // 使用 useNavigate 代替 useHistory
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function SigninJp() {
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
        setErrorMessage('パスワードと確認用パスワードが一致しません');
        setIsLoading(false);
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)

      .then(() => auth.signOut()) // 立即登出

      .then(() => { 
        if (isMounted.current) {
          setIsLoading(false);
          navigate('/jp/registersuccess');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (isMounted.current) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setErrorMessage('メールアドレスは既に使用されています');
              break;
            case 'auth/invalid-email':
              setErrorMessage('無効なメールアドレスです');
              break;
            case 'auth/weak-password':
              setErrorMessage('パスワードが弱すぎます');
              break;
            default:
              setErrorMessage('エラーが発生しました。後で再試行してください');
          }
          setIsLoading(false);
        }
      });

    } else if (activeItem === 'signin') {

      signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (isMounted.current) {
          navigate('/jp/posts');  // 使用 navigate 代替 history.push
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (isMounted.current) {
          switch (error.code) {
            case 'auth/invalid-email':
              setErrorMessage('無効なメールアドレスです');
              break;
            case 'auth/invalid-credential':
              setErrorMessage('メールアドレスまたはパスワードが間違っています');
              break;
            default:
              setErrorMessage('エラーが発生しました。後で再試行してください');
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
          ログイン
        </Menu.Item>
          
        <Menu.Item active={activeItem === 'register'} onClick={() => {
          setErrorMessage('')
          setActiveItem('register')}}>
          新規登録
        </Menu.Item>
      </Menu>

      <Form onSubmit={onSubmit}>
        <Form.Input label='メールアドレス' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='メールアドレスを入力してください' />
        <Form.Input label='パスワード' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='パスワードを入力してください' />
        {activeItem === 'register' && (
          <Form.Input 
            label='パスワード（確認用）' 
            type={showPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder='パスワードを入力してください' 
          />
        )}
        <Form.Field>
          <Checkbox label='パスワードを表示する' checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
        </Form.Field>
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Form.Button loading={isLoading}>
          {activeItem === 'signin' && 'ログイン'}
          {activeItem === 'register' && '登録'}
        </Form.Button>
      </Form>
    </Container>
  );
}

export default SigninJp;
