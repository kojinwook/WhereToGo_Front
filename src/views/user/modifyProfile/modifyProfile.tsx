import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './style.css';

Modal.setAppElement('#root');

// 모달 스타일 설정
const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 투명도 설정
    },
    content: {
        width: '200px', // 모달 너비
        height: '300px', // 모달 높이
        top: '50%', // 화면 상단에서 50% 위치
        left: '50%', // 화면 왼쪽에서 50% 위치
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)', // 화면 중앙 정렬
        border: '1px solid #ccc', // 테두리 설정
        borderRadius: '5px', // 둥근 모서리 설정
        backgroundColor: '#fff', // 배경색 설정
        padding: '20px', // 안쪽 여백
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 설정
    },
};

export default function UserModifyProfile() {
    const [userId, setUserId] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false); // 닉네임 변경 모달
    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false); // 이메일 변경 모달
    const [isPwModalOpen, setIsPwModalOpen] = useState<boolean>(false); // 비밀번호 변경 모달
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false); // 탈퇴 모달

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const toggleNicknameModal = () => {
        setIsNicknameModalOpen(!isNicknameModalOpen);
        if (!isNicknameModalOpen) {
            setUserNickname(userNickname); // 현재 닉네임
        } else {
            setUserNickname(''); // 초기화
        }
    }

    const toggleEmailModal = () => {
        setIsEmailModalOpen(!isEmailModalOpen);
        if (!isEmailModalOpen) {
            setEmail(email);
        } else {
            setEmail('');
        }
    };

    const togglePwModal = () => {
        setIsPwModalOpen(!isPwModalOpen);
        if (isPwModalOpen) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }

    const toggleWithdrawalModal = () => setIsWithdrawalModalOpen(!isWithdrawalModalOpen);

    const handleNicknameSubmit = () => {
        if (!userNickname) {
            alert('닉네임을 입력하세요.');
            return;
        }
        console.log('수정된 닉네임:', userNickname);
        setIsNicknameModalOpen(false); // 모달 닫기
    };

    const handleEmailSubmit = () => {
        if (!email) {
            alert('이메일을 입력하세요.');
            return;
        }
        console.log('수정된 이메일:', email);
        setIsEmailModalOpen(false); // 모달 닫기
    }

    const handlePasswordSubmit = () => {
        if (!currentPassword) {
            alert('현재 비밀번호를 입력하세요.');
            return;
        }
        if (!newPassword) {
            alert('새 비밀번호를 입력하세요.');
            return;
        }
        if (!confirmNewPassword) {
            alert('새 비밀번호 확인을 입력하세요.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        console.log('기존 비밀번호:', currentPassword);
        console.log('새 비밀번호:', newPassword);
        setIsPwModalOpen(false); // 모달 닫기
    };

    const handleWithdrawal = () => {
        if (!userId) {
            alert('아이디를 적어주세요.');
            return;
        }
        if (!currentPassword) {
            alert('비밀번호를 적어주세요.');
            return;
        }
        console.log('아이디:', userId);
        console.log('비밀번호:', currentPassword);
        alert('탈퇴되었습니다.');
        setIsWithdrawalModalOpen(false); // 모달 닫기
        navigate('/'); // 탈퇴 후 홈페이지로 이동
    };

    return (
        <div className='mp-container'>
            <h2>사용자 프로필 수정</h2>
            <div className='modify-information'>
                <div className='nickname-change-button' onClick={toggleNicknameModal}>닉네임 변경</div>
                <div className='email-change-button' onClick={toggleEmailModal}>이메일 변경</div>
                <div className='pw-change-button' onClick={togglePwModal}>비밀번호 변경</div>
            </div>
            <div>
                <div className='withdrawal' onClick={toggleWithdrawalModal}>탈퇴</div>
            </div>
            <Modal
                isOpen={isNicknameModalOpen}
                onRequestClose={toggleNicknameModal}
                style={modalStyle}
                contentLabel='닉네임 수정'
            >
                <h2>닉네임 수정</h2>
                <input
                    type="text"
                    value={userNickname}
                    onChange={(e) => setUserNickname(e.target.value)}
                    placeholder="새 닉네임 입력"
                />
                <button onClick={handleNicknameSubmit}>수정</button>
                <button onClick={toggleNicknameModal}>취소</button>
            </Modal>

            <Modal
                isOpen={isEmailModalOpen}
                onRequestClose={toggleEmailModal}
                style={modalStyle}
                contentLabel='이메일 수정'
            >
                <h2>이메일 수정</h2>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="새 이메일 입력"
                />
                <button onClick={handleEmailSubmit}>수정</button>
                <button onClick={toggleEmailModal}>취소</button>
            </Modal>

            <Modal
                isOpen={isPwModalOpen}
                onRequestClose={togglePwModal}
                style={modalStyle}
                contentLabel='비밀번호 수정'
            >
                <h2>비밀번호 수정</h2>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="기존 비밀번호 입력"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 입력"
                />
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="새 비밀번호 확인"
                />
                <button onClick={handlePasswordSubmit}>수정</button>
                <button onClick={togglePwModal}>취소</button>
            </Modal>

            <Modal
                isOpen={isWithdrawalModalOpen}
                onRequestClose={toggleWithdrawalModal}
                style={modalStyle}
                contentLabel='탈퇴 확인'
            >
                <h2>정말 탈퇴하시겠습니까?</h2>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="아이디 입력"
                />
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                />
                <button onClick={handleWithdrawal}>탈퇴</button>
                <button onClick={toggleWithdrawalModal}>취소</button>
            </Modal>
        </div>
    )
}
