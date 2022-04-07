import './css/style.scss';
import InsertUsers from './components/InsertUsers';
import GetUsers from './components/GetUsers';
import { GlobalContext } from './utils/GlobalContext';

function App() {

  return (
    <GlobalContext>
      <div className="App">
        <InsertUsers/>
        <GetUsers/>
      </div>
    </GlobalContext>
  );
}

export default App;
