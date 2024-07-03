import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import FestivalPage from 'views/festival/festival';
import SaveFestivalList from 'components/festival';

function App() {

  return (
    <Routes>
      <Route path="/" element={<FestivalPage />}/>
      <Route path="/save" element={<SaveFestivalList />}/>
    </Routes>
  );
}

export default App;
