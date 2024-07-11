import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import FestivalPage from 'views/festival/list/festival-list';
import FestivalAdmin from 'views/festival/admin/festival-admin';
import SaveFestivalList from 'components/festival/save-festival';
import FestivalDetail from 'views/festival/detail/festival-detail';
import ReviewWritePage from 'views/festival/review/write/write';
import ReviewUpdatePage from 'views/festival/review/update/update';
import ChatRoom from 'components/chat/chat';
import ChatRoomCreate from 'components/chat/create';

function App() {

  return (
    <Routes>
      <Route path='/festival'>
        <Route path="search" element={<FestivalPage />} />
        <Route path="save" element={<SaveFestivalList />} />
        <Route path="admin" element={<FestivalAdmin />} />
        <Route path="detail" element={<FestivalDetail />} />
        <Route path="review/write" element={<ReviewWritePage />} />
        <Route path="review/update" element={<ReviewUpdatePage />} />
      </Route>
      <Route path='/chat'>
        <Route path="create" element={<ChatRoomCreate />} />
        <Route path="" element={<ChatRoom />} />
      </Route>
    </Routes>
  );
}

export default App;
