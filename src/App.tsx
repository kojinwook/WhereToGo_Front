import React, { useEffect } from 'react';
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
import AdminSignUp from 'views/Authentication/admin/SignUp/admin-signup';
import SignUp from 'views/Authentication/SignUp/signup';
import SignIn from 'views/Authentication/SignIn/signin';
import InquireDetail from 'views/inquire/detail/inquire-detail';
import InquireUpdate from 'views/inquire/update/inquire-update';
import InquireWrite from 'views/inquire/write/inquire-write';
import NoticeDetail from 'views/notice/detail/notice-detail';
import NoticeWrite from 'views/notice/write/notice-write';
import NoticeUpdate from 'views/notice/update/notice-update';
import useLoginUserStore from 'store/login-user.store';
import { useCookies } from 'react-cookie';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response/response';
import User from 'types/interface/user.interface';
import { GetSignInUserRequest } from 'apis/apis';
import Inquire from 'views/inquire/main/inquire-main';
import InquireList from 'views/inquire/list/inquire-list';
import NoticeList from 'views/notice/main/notice-main';

function App() {

  const { setLoginUser, resetLoginUser } = useLoginUserStore();
  const [cookies, setCookies] = useCookies();

  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {

    if (!responseBody) return;
    const { code } = responseBody;

    if (code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
    setLoginUser(loginUser);
  }

  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    GetSignInUserRequest(cookies.accessToken).then(getSignInUserResponse)
  }, [cookies.accessToken]);

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

      <Route path='chat' element={<ChatRoom />} />

      <Route path='/user'>
        <Route path="profile/:userId" element={<UserProfile />} />
        <Route path='modifyProfile' element={<UserModifyProfile />} />
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

      <Route path='/authentication'>
        <Route path="admin" element={<AdminSignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route path='/inquire'>
        <Route path="" element={<Inquire />} />
        <Route path="detail/:questionId" element={<InquireDetail />} />
        <Route path="write" element={<InquireWrite />} />
        <Route path="update/:questionId" element={<InquireUpdate />} />
        <Route path="main" element={<InquireList />} />
        <Route path="detail" element={<InquireDetail />} />
        <Route path="write" element={<InquireWrite />} />
        <Route path="update" element={<InquireUpdate />} />
        <Route path="list" element={<InquireList />} />
      </Route>

      <Route path='/notice'>
        <Route path="" element={<NoticeList />} />
        <Route path="detail" element={<NoticeDetail />} />
        <Route path="write" element={<NoticeWrite />} />
        <Route path="update" element={<NoticeUpdate />} />
      </Route>
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>

  );
}

export default App;
