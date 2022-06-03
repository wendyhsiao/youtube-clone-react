import {HashRouter, Routes, Route, Link} from "react-router-dom";

import './App.css';
import WatchPage from './pages/WatchPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<WatchPage/>} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
