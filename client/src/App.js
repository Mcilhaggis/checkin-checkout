import './css/style.scss';
import NewNotification from './components/NewNotification';
import OldNotification from './components/OldNotification';
import InsertUsers from './components/InsertUsers';
import GetUsers from './components/GetUsers';
import { GlobalContext } from './utils/GlobalContext';

function App() {

  return (
    <GlobalContext>
      <div className="App">
        <NewNotification/>
        <OldNotification/>
        <InsertUsers/>
        <GetUsers/>
      </div>
    </GlobalContext>
  );
}

export default App;
