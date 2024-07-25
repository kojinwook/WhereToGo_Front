import React from 'react'
import { useNavigate } from 'react-router-dom';
import logoImage from 'assets/images/logo.png';

const Footer : React.FC = () => {
    const navigate = useNavigate();
    const onLogoClickHandler = () => {
        navigate(`/`);
    }



    return (
        <footer>
        <div>
        <div>고객센터 0000-0000</div>
        <div>서비스 이용약관</div>
        <div>개인정보 처리방침</div>
        </div>
        <div>여기갈래?</div>
        <img src={logoImage} alt="뒤로가기" onClick={onLogoClickHandler} />
        <div>
            <div>사업자 번호 000-00-</div>
            <div>주소 : 대전광역시 서구 둔산로 52</div>
        </div>
        </footer>
      )


}


export default Footer;
