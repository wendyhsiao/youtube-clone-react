import {HashRouter, Routes, Route, Link} from "react-router-dom";

import './App.css';
import Header from './components/Header';
import WatchPage from './pages/WatchPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<WatchPage/>} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
