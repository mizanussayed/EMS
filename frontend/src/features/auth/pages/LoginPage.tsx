import { useState } from 'react';
import LoginForm from '../ui/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loginLoading, loginError } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LoginForm
      userName={userName}
      password={password}
      loading={loginLoading}
      errorMessage={loginError}
      onUserNameChange={setUserName}
      onPasswordChange={setPassword}
      onSubmit={() => login(userName.trim(), password)}
    />
  );
}