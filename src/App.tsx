import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import FestivalPage from 'views/festival/list/festival-list';
import FestivalAdmin from 'views/festival/admin/festival-admin';
import SaveFestivalList from 'components/festival/save-festival';

function App() {

  return (
    <Routes>
      <Route path='/festival'>
        <Route path="search" element={<FestivalPage />} />
        <Route path="save" element={<SaveFestivalList />} />
        <Route path="admin" element={<FestivalAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;
