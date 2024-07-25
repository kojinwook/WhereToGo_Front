import React from 'react'
import { useNavigate } from 'react-router-dom';
import logoImage from 'assets/images/logo.png';
import './style.css';

const Footer : React.FC = () => {
    const navigate = useNavigate();
    const onLogoClickHandler = () => {
        navigate(`/`);
    }



    return (
        <footer>
        <div className='footer-container'>
        <div>고객센터 0000-0000</div>
        <div>서비스 이용약관</div>
        <div>개인정보 처리방침</div>
        </div>
        <div>여기갈래?</div>
        <img src={logoImage} alt="뒤로가기" onClick={onLogoClickHandler} />
        <div>
            <div>대표이사 고진욱</div>
            <div>사원 : 유신형, 장민규 , 김예지</div>
            <div>사업자 번호 000-00-</div>
            <div>주소 : 대전광역시 서구 둔산로 52</div>
        </div>
        </footer>
      )


}


export default Footer;
