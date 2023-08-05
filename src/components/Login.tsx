import { FormEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import { useStores } from '../hooks/use-stores.hook';
import { authService } from '../services/auth.service';
import { TimeDelayTypesEnum, utilsService } from '../services/utils.service';
import { configService } from '../services/config.service';

const LoginContainer = styled.form<{ color?: string }>`
  border: 1px solid blue;
  display: flex;
  gap: 1em;
  align-items: center;
  padding: 1em;
  border-radius: 100px;
  background-color: ${({ color }) => (color ? color : 'inherit')};

  & button {
    display: flex;
    padding: 10px 20px;
    border: 1px solid red;
    border-radius: 100px;
    background: var(--blue-active-color);
    transition: 0.3s ease-in-out opacity, box-shadow;
    cursor: pointer;

    &:hover {
      opacity: 0.85;
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    }
  }
`;

const Input = styled.input.attrs(({ type }) => ({
  type: type || 'password',
}))`
  width: 100%;
  border: 1 px orange;
  background: transparent;
  color: #424242;

  &::placeholder {
    color: #7b7b7b;
    font-size: 1em;
  }

  @media (max-width: 820px) {
    font-size: 0.7em;
  }
`;

const Login = () => {
  console.log(`RENDER LOGIN`);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const lastSubmit = useRef<number | null>(null);
  const [color, setColor] = useState('inherit');
  const [fail, setFail] = useState(false);

  const { userStore } = useStores();

  const highlight = (color: string, fail = false): void => {
    if (fail) {
      setFail(fail);
    }

    setColor(color);
    setTimeout(() => {
      setColor('inherit');
    }, 100);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const login = loginRef.current?.value;
    const password = passwordRef.current?.value;

    if (
      !(login && password) ||
      !utilsService.canInvoke(
        configService.TIME_DELAYS.debounce,
        lastSubmit,
        TimeDelayTypesEnum.debounce,
      )
    ) {
      return;
    }

    authService.login(login, password, userStore, highlight).catch(() => {
      highlight('red', true);
    });
  };

  return (
    <LoginContainer onSubmit={handleSubmit} color={color}>
      {fail ? <h1>Try again!!!</h1> : ''}

      <Input type="text" placeholder="username" ref={loginRef} />
      <Input type="password" placeholder="password" ref={passwordRef} />

      <button type="submit">Go!</button>

      <p className="message">
        Not registered? <a href="#">Sign up</a>
      </p>
    </LoginContainer>
  );
};

export default Login;
