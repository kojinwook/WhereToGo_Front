import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import logoImage from 'assets/images/logo.png';
import './style.css';
import { spawn } from 'child_process';
import { useCookies } from 'react-cookie';
import bellButton from 'assets/images/bell.png';

export default  function Header() {
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const [dropdownVisible , setDropdownVisible] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    const role = loginUser?.role;
    if(!role) return;
    setRole(role);
  }, [loginUser])

  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser])

  const LogoClickHandler = () => {
    navigate('/');
  }
  const MyProfilePathClickHandler = () => {
    if(role === 'ROLE_ADMIN') navigate('/admin/profile');
    if(role === 'ROLE_USER') navigate('/user/profile');
    setDropdownVisible(false);
  }
  const onSignInButtonClickHandler = () => {
    navigate('/authentication/signin');
  }
  const onSignUpButtonClickHandler = () => {
    navigate('/authentication/signup');
  }
  const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookie('accessToken','',{ path: '/', expires:new Date()})
    navigate('/');
    setDropdownVisible(false);
  }
  const nicknamePathClickHandler =() => {
    setDropdownVisible(!dropdownVisible);
  }

  const NoticePathClickHandler = () => {
    navigate('/notice');
  }
  const FestivalPathClickHandler = () => {
    navigate('/festival/search');
  }
  const meetingPathClickHandler = () => {
    navigate('/meeting/list');
  }
  const inquirePathClickHandler = () => {
    navigate('/inquire/list');
  }


  return (
    <header className='header'>
      <div  className='logo-container'>
        <img src={logoImage} alt="뒤로가기" onClick={LogoClickHandler} />
      </div>

      <div className="main-header">
        <div className="header-item" onClick={inquirePathClickHandler}>고객센터</div>
        <div className="header-item" onClick={NoticePathClickHandler}>공지사항</div>
        <div className="header-item" onClick={FestivalPathClickHandler}>축제</div>
        <div className="header-item" onClick={meetingPathClickHandler}>모임</div>
      </div>

      <div className='nav-container'>
          {!isLogin && <div onClick={onSignInButtonClickHandler}>로그인</div> }
          {!isLogin && <div onClick={onSignUpButtonClickHandler}>회원가입</div> }
          {isLogin && (
            <div className="header-user-info">
              <img className="notification" />
              <div className="nickname" onClick={nicknamePathClickHandler}>
                {loginUser?.nickname}님
              </div>
              {role === 'ROLE_ADMIN' && <span>(관리자)</span>}
              {dropdownVisible &&(
                <div className="dropdown-menu">
                  <div onClick={MyProfilePathClickHandler}>프로필</div>
                  <div onClick={onSignOutButtonClickHandler}>로그아웃</div>
                </div>
              )}
            </div>
          )}
      </div>
    </header>
  )
}
