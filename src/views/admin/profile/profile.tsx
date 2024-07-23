import React, { useEffect, useState } from 'react'
import logoImage from 'assets/images/logo.png';
import inquiryIcon from 'assets/images/inquiry.png';
import noticeIcon from 'assets/images/notice.png';
import managementIcon from 'assets/images/management.png';
import festivalIcon from 'assets/images/festival.png';
import './style.css';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { GetUserRequest } from 'apis/apis';
import { useCookies } from 'react-cookie';



export default function AdminProfile() {
    const { loginUser } = useLoginUserStore();
    const userId = loginUser?.userId;
    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [cookies] = useCookies()
    const navigate = useNavigate();

    const inquirePathClickHandler = () => {
        navigate('/inquire/list')
    }

    const noticePathClickHandler = () => {
        navigate("/notice");
    }    
    useEffect(() => {
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            navigate('/authentication/signin');
            return;
        }
        if (loginUser && loginUser.role !== 'ROLE_ADMIN') {
            alert('관리자만 접근 가능합니다.');
            navigate('/');
        }
    }, [loginUser]);

    useEffect(() => {
        if (!userId) return;
        const fetchUser = async () => {
            const response = await GetUserRequest(userId, cookies.accessToken);
            if(!response) return;
            const { nickname, email, profileImage } = response;
            setNickname(nickname);
            setEmail(email);
            setProfileImage(profileImage);
        }
        fetchUser();
    }, []);

    const handleFestivalClickHandler = () => {
        navigate('/festival/admin');
    }

    const handleManagementClickHandler = () => {
        navigate("/admin/management");
    }

    return (
        <div className='admin-profile-wrapper'>
            <div className='admin-profile-container'>
                <div className='admin-profile-image-dox'>
                    <img src={logoImage} alt="로고이미지" className='admin-profile-image' />
                </div>
                <div className='admin-profile-nickname'>
                    <div><strong>관리자</strong></div>
                </div>
            </div>
            <div className='admin-setting-button'>
                <div className='inquiry-button' onClick={inquirePathClickHandler}>
                    <img src={inquiryIcon} alt="문의 아이콘" className='inquiry-icon' />
                    <div className='inquiry-text' >문의</div>
                </div>
                <div className='notice-button'  onClick={noticePathClickHandler}>
                    <img src={noticeIcon} alt="공지사항 아이콘" className='notice-icon' />
                    <div className='notice-text'>공지사항</div>
                </div>
                <div className='management-button'>
                    <img src={managementIcon} alt="회원관리 아이콘" className='management-icon' onClick={handleManagementClickHandler}/>
                    <div className='management-text'>회원관리</div>
                </div>
                <div className='festival-button'>
                    <img src={festivalIcon} alt="축제 아이콘" className='festival-icon' onClick={handleFestivalClickHandler}/>
                    <div className='festival-text'>축제</div>
                </div>
            </div>
        </div>
    )
}
