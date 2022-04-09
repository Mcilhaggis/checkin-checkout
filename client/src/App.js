import './css/style.scss';
import Notification from './components/Notification';
import InsertUsers from './components/InsertUsers';
import GetUsers from './components/GetUsers';
import { GlobalContext } from './utils/GlobalContext';

function App() {

  return (
    <GlobalContext>
      <div className="App">
        <Notification/>
        <InsertUsers/>
        <GetUsers/>
      </div>
    </GlobalContext>
  );
}

export default App;
