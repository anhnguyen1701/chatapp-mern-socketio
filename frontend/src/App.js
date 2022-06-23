import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import Home from './Pages/NewApp/home/Home';

function App() {
  return (
    <>
      <Route path="/home" component={Home} />
      <div className="App">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
      </div>
    </>
  );
}

export default App;
