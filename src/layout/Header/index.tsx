import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import logoImage from 'assets/images/logo.png';
import './style.css';
import { spawn } from 'child_process';
import { useCookies } from 'react-cookie';

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


  return (
    <header className='header'>
      <div  className='logo-container'>
        <img src={logoImage} alt="뒤로가기" onClick={LogoClickHandler} />
      </div>
      <div className='nav-container'>
          {!isLogin && <div onClick={onSignInButtonClickHandler}>로그인</div> }
          {!isLogin && <div onClick={onSignUpButtonClickHandler}>회원가입</div> }
          {isLogin && (
            <div>
              {role === 'ROLE_ADMIN' &&  <span>(관리자)</span>}
              <div onClick={nicknamePathClickHandler}>{loginUser?.nickname}님</div>
              {dropdownVisible &&(
                <div>
                  <div onClick={onSignOutButtonClickHandler}>로그아웃</div>
                  <div onClick={MyProfilePathClickHandler}>프로필</div>
                </div>
              )}
              <div>알림</div>
            </div>
          )}
      </div>
    </header>
  )
}
