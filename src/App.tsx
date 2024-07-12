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
import UserProfile from 'views/user/profile/profile';
import UserModifyProfile from 'views/user/modifyProfile/modifyProfile';
import AdminProfile from 'views/admin/profile/profile';
import MeetingWrite from 'views/meeting/write/write';

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

      <Route path='chat' element={<ChatRoom/>}/>

      <Route path='/user'>
        <Route path="profile" element={<UserProfile />}/>
        <Route path='modifyProfile' element={<UserModifyProfile />}/>
      </Route>

      <Route path='/chat'>
        <Route path="create" element={<ChatRoomCreate />} />
        <Route path="" element={<ChatRoom />} />
      </Route>

      <Route path='/admin'>
        <Route path='profile' element={<AdminProfile />} />
      </Route>

      <Route path='/meeting'>
        <Route path='write' element={<MeetingWrite />} />
      </Route>
      
    </Routes>
  );
}

export default App;
