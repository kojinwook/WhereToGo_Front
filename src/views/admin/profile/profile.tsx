import React from 'react'
import logoImage from 'assets/images/logo.png';
import inquiryIcon from 'assets/images/inquiry.png';
import noticeIcon from 'assets/images/notice.png';
import managementIcon from 'assets/images/management.png';
import festivalIcon from 'assets/images/festival.png';
import './style.css';
import { useNavigate } from 'react-router-dom';



export default function AdminProfile() {
    const navigate = useNavigate();



    const inquirePathClickHandler = () => {
        navigate("/notice/write");
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
                <div className='inquiry-button'>
                    <img src={inquiryIcon} alt="문의 아이콘" className='inquiry-icon' />
                    <div className='inquiry-text' >문의</div>
                </div>
                <div className='notice-button'  onClick={inquirePathClickHandler}>
                    <img src={noticeIcon} alt="공지사항 아이콘" className='notice-icon' />
                    <div className='notice-text'>공지사항</div>
                </div>
                <div className='management-button'>
                    <img src={managementIcon} alt="회원관리 아이콘" className='management-icon' />
                    <div className='management-text'>회원관리</div>
                </div>
                <div className='festival-button'>
                    <img src={festivalIcon} alt="축제 아이콘" className='festival-icon' />
                    <div className='festival-text'>축제</div>
                </div>
            </div>
        </div>
    )
}
