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
        <footer className='footer'>
            <div className='footer-line'>
                <div className='footer-container'>
                    <div className='center'>고객센터 0000-0000</div>
                    <div>서비스 이용약관</div>
                    <div>개인정보 처리방침</div>
                    <div className='footer-logo'>
                        <img src={logoImage} alt="뒤로가기" onClick={onLogoClickHandler} />
                    </div>
                </div>
                <div className='footer-right'>
                    <div>사업자 번호 000-00-</div>
                    <div>주소 : 대전광역시 서구 둔산로 52</div>
                    <div>©  JU WOE _ JU WOE</div>
                </div>
            </div>
        </footer>
      )


}


export default Footer;
