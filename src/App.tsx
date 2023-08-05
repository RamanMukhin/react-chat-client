import { observer } from 'mobx-react';
import './App.css';

import GlobalStyle from './common/reset-css';
import Login from './components/Login';
import { useStores } from './hooks/use-stores.hook';
import ChatContainer from './components/Chat-container';
import { useEffect } from 'react';
import { socketService } from './services/socket.service';

const App = observer(() => {
  console.log(`RENDER APP`);
  const { userStore } = useStores();

  useEffect(() => {
    if (userStore.authorized) {
      socketService.connect();

      return () => {
        socketService.disconnect();
      };
    }
  }, [userStore.authorized]);

  return (
    <>
      <GlobalStyle />

      {userStore.authorized ? (
        <>
          <ChatContainer />
        </>
      ) : (
        <Login />
      )}
    </>
  );
});

export default App;
