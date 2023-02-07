import {HashRouter, Routes, Route, Link} from "react-router-dom";

import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import WatchPage from './pages/WatchPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/watch" element={<WatchPage/>} />
          <Route path="/results" element={<ResultsPage/>}  />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
