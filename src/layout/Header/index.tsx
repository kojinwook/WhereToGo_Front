import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import logoImage from 'assets/images/logo.png';
import './style.css';

export default  function Header() {
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const navigate = useNavigate();

  const LogoClickHandler = () => {
    navigate('/');
  }
  const myprofilePathClickHandler = () => {
    navigate('/user/profile');
  }



  return (
    <header className='header'>
      <div className='logo-container'>
        <img src={logoImage} alt="뒤로가기" onClick={LogoClickHandler} />
      </div>
      <div className='nav-container'>
        <span>알림</span>
        <span onClick={myprofilePathClickHandler}>프로필</span>
      </div>
    </header>
  )
}

