import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import Home from './Pages/NewApp/home/Home';
import Profile from './Pages/NewApp/profile/Profile';

function App() {
  return (
    <>
      <Route path="/home" component={Home} />
      <Route path="/profile/:username" component={Profile}></Route>
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </>
  );
}

export default App;
