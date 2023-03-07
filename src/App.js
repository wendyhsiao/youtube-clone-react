import {HashRouter, Routes, Route, Link} from "react-router-dom";
import React, { useState } from 'react';

import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import WatchPage from './pages/WatchPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const [searchInput, setSearchInput] = useState("");
  const onSearchInput = (val) => {
    setSearchInput(val);
  };

  return (
    <div className="App">
      <HashRouter>
        <Header searchInput={searchInput} onSearchInput={onSearchInput}/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/watch" element={<WatchPage/>} />
          <Route path="/results" element={<ResultsPage onSearchInput={onSearchInput}/>}  />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
