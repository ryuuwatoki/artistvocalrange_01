import React from "react";
import { Menu, Form, Container, Checkbox, Message } from "semantic-ui-react";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";  // 使用 useNavigate 代替 useHistory
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function SigninEn() {
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
        setErrorMessage('Passwords do not match');
        setIsLoading(false);
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)

      .then(() => auth.signOut()) // 立即登出

      .then(() => { 
        if (isMounted.current) {
          setIsLoading(false);
          navigate('/en/registersuccess');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (isMounted.current) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setErrorMessage('Email already exists');
              break;
            case 'auth/invalid-email':
              setErrorMessage('Invalid email format');
              break;
            case 'auth/weak-password':
              setErrorMessage('Password is too weak');
              break;
            default:
              setErrorMessage('An error occurred, please try again later');
          }
          setIsLoading(false);
        }
      });

    } else if (activeItem === 'signin') {

      signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (isMounted.current) {
          navigate('/en/posts');  // 使用 navigate 代替 history.push
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (isMounted.current) {
          switch (error.code) {
            case 'auth/invalid-email':
              setErrorMessage('Invalid email format');
              break;
            case 'auth/invalid-credential':
              setErrorMessage('Incorrect email or password');
              break;
            default:
              setErrorMessage('An error occurred, please try again later');
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
          Sign in
        </Menu.Item>
          
        <Menu.Item active={activeItem === 'register'} onClick={() => {
          setErrorMessage('')
          setActiveItem('register')}}>
          Register
        </Menu.Item>
      </Menu>

      <Form onSubmit={onSubmit}>
        <Form.Input label='Email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Please enter your email' />
        <Form.Input label='Password' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Please enter your password' />
        {activeItem === 'register' && (
          <Form.Input 
            label='Confirm Password' 
            type={showPassword ? 'text' : 'password'} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder='Please confirm your password' 
          />
        )}
        <Form.Field>
          <Checkbox label='Show Password' checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
        </Form.Field>
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Form.Button loading={isLoading}>
          {activeItem === 'signin' && 'Sign in'}
          {activeItem === 'register' && 'Register'}
        </Form.Button>
      </Form>
    </Container>
  );
}

export default SigninEn;
