import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import SaveFestivalList from './components/festival';

function App() {

  return (
    <Routes>
      <Route path="/" element={<SaveFestivalList />}/>
    </Routes>
  );
}

export default App;
