import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import logoImage from 'assets/images/logo.png';

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
    <>
    <div>
      <img src={logoImage} alt="뒤로가기" onClick={LogoClickHandler} />
    </div>
    <div>
      <span>알림</span>
      <span onClick={myprofilePathClickHandler}>프로필</span>
    </div>
    </>
  )
}

