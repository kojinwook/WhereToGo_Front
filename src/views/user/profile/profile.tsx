import { GetAllFavoriteRequest, GetChatRoomRequest, GetUserBoardListRequest, GetUserMeetingListRequest, GetUserRequest, VerifyPasswordRequest } from 'apis/apis';
import { GetUserResponseDto } from 'apis/response/user';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';
import Switch from 'react-switch';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import './style.css';
import defaultProfileImage from 'assets/images/user.png';
import boardIcon from 'assets/images/board.png';
import chatIcon from 'assets/images/chat.png';
import groupIcon from 'assets/images/group.png';
import heartIcon from 'assets/images/heartIcon.png';
import settingIcon from 'assets/images/setting.png';
import starIcon from 'assets/images/star.png';
import { ResponseDto } from 'apis/response/response';
import { ChatRoom, Favorite, Meeting } from 'types/interface/interface';
import Thermometer from 'components/Thermometer/Thermometer';
import { VerifyPasswordRequestDto } from 'apis/request/user';

// 모달 스타일 설정
const modalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 투명도 설정
    },
    content: {
        width: '400px', // 모달 너비
        height: '500px', // 모달 높이
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
        zIndex: '100', // z-index 설정
    },
};

const passwordModalStyle = {
    ...modalStyle,
    overlay: {
        zIndex: '200',
    },
    content: {
        ...modalStyle.content,
        width: '300px', // 비밀번호 모달의 너비
        height: '200px', // 비밀번호 모달의 높이
    }
};

export default function UserProfile() {
    const { loginUser } = useLoginUserStore();
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    const userId = loginUser?.userId;
    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [temperature, setTemperature] = useState<number>(0); // 온도
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [meetingList, setMeetingList] = useState<Meeting[]>([]); // 모임 목록
    const [boardList, setBoardList] = useState<any[]>([]); // 게시물 목록

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const [isHeartModalOpen, setIsHeartModalOpen] = useState<boolean>(false); // 찜 모달 열림 상태
    const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false); // 모임 모달 열림 상태
    const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false); // 게시물 모달 열림 상태
    const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false); // 채팅 모달 열림 상태
    const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false); // 설정 모달 열림 상태

    // 알림
    const handleNotificationChange = (checked: boolean) => {
        setIsNotificationEnabled(checked);
    };

    // 로그아웃
    const handleLogoutClick = () => {
        removeCookie('accessToken');
        navigate('/');
    };

    useEffect(() => {
        if (!userId) return;
        const fetchUserBoardList = async () => {
            try {
                const response = await GetUserBoardListRequest(userId, cookies.accessToken);
                if (!response) return;
                if (response.code === 'SU') {
                    setBoardList(response.boardList);
                } else {
                    console.log('게시물 목록을 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserBoardList();
    }, [userId, cookies.accessToken]);

    useEffect(() => {
        const fetchUserMeetingList = async () => {
            try {
                const response = await GetUserMeetingListRequest(cookies.accessToken);
                console.log('response', response);
                if (!response) return;
                if (response.code === 'SU') {
                    setMeetingList(response.meetingList);
                } else {
                    console.log('모임 목록을 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserMeetingList();
    }, [userId, cookies.accessToken]);

    useEffect(() => {
        if (!userId) return;
        GetUserRequest(userId).then((responseBody: GetUserResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'NU') {
                alert('존재하지 않는 유저입니다.');
                return;
            }
            if (code === 'DBE') {
                alert('데이터베이스 오류입니다.');
                return;
            }
            if (code !== 'SU') {
                navigate('/');
                return;
            }
            const { nickname, email, profileImage, temperature } = responseBody;
            setNickname(nickname);
            setEmail(email);
            setProfileImage(profileImage);
            setTemperature(temperature);
        });
    }, [userId, cookies.accessToken]);

    useEffect(() => {
        if (!loginUser) { alert('로그인 후 이용해주세요.'); navigate('/authentication/signin'); return; };
        getAllFavorite(loginUser.nickname);
        getChatRooms(loginUser.nickname);
    }, [loginUser]);

    // 모달 열기/닫기 이벤트 핸들러
    const toggleHeartModal = () => setIsHeartModalOpen(!isHeartModalOpen);
    const toggleGroupModal = () => setIsGroupModalOpen(!isGroupModalOpen);
    const toggleBoardModal = () => setIsBoardModalOpen(!isBoardModalOpen);
    const toggleChatModal = () => setIsChatModalOpen(!isChatModalOpen);
    const toggleSettingModal = () => setIsSettingModalOpen(!isSettingModalOpen);

    const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(true); // 알림 설정 상태

    const getAllFavorite = async (nickname: string) => {
        if (!loginUser) {
            alert('로그인 후 이용해주세요.');
            navigate('/authentication/signin');
            return;
        }
        try {
            const response = await GetAllFavoriteRequest(nickname, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                setFavorites(response.favoriteList);
            } else {
                console.log('찜 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateStr: string) => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
    };

    const getChatRooms = async (nickname: string) => {
        if (!loginUser) {
            alert('로그인 후 이용해주세요.');
            navigate('/login');
            return;
        }
        try {
            const response = await GetChatRoomRequest(nickname, cookies.accessToken);
            console.log('response', response);
            if (!response) return;
            if (response.code === 'SU') {
                setChatRooms(response.chatRoomList);
            } else {
                console.log('채팅 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const togglePasswordModal = () => setIsPasswordModalOpen(!isPasswordModalOpen);

    const handleProfileChangeClick = () => {
        togglePasswordModal();
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handlePasswordSubmit = async () => {
        try {
            const requestBody: VerifyPasswordRequestDto = { password: password };
            const response = await VerifyPasswordRequest(requestBody, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                togglePasswordModal();
                navigate('/user/modifyProfile');
            } else {
                setPasswordError('비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error(error);
            setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
        }
    };

    const handleFestivalTitleClick = (contentId: string) => {
        navigate(`/festival/detail?contentId=${contentId}`);
    };

    const handleMeetingTitleClick = (meetingId: string | number) => {
        navigate(`/meeting/detail/${meetingId}`);
    }

    const handleBoardTitleClick = (meetingBoardId: string | number, meetingId: string | number) => {
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    }

    const handleChatRoomClick = (roomId: string, userId: string) => {
        navigate(`/chat?roomId=${roomId}&userId=${userId}`);
    };

    const handleStarIconClick = () => {
        navigate(`/user/review/${nickname}`)
    }

    return (
        <div id='user-profile-wrapper'>
            <div className='user-profile-container'>
                <div className='user-profile-image-box'>
                    <img src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' className='user-profile-image' />
                </div>
                <div className='user-profile-info-box'>
                    <div className='user-profile-info-nickname'>{nickname}</div>
                    <div className='user-profile-info-email'>{email}</div>
                    <Thermometer temperature={temperature} />
                </div>
            </div>
            <div className='user-profile-button'>
                <div className='heart-button' onClick={toggleHeartModal}>
                    <img src={heartIcon} alt='하트 아이콘' className='heart-icon' />
                    <div className='heart-text'>나의 찜</div>
                </div>
                <div className='group-button' onClick={toggleGroupModal}>
                    <img src={groupIcon} alt='모임 아이콘' className='group-icon' />
                    <div className='group-text'>내 모임</div>
                </div>
                <div className='board-button' onClick={toggleBoardModal}>
                    <img src={boardIcon} alt='게시물 아이콘' className='board-icon' />
                    <div className='board-text'>내 게시물</div>
                </div>
                <div className='star-button'>
                    <img src={starIcon} alt='후기 아이콘' className='star-icon' onClick={handleStarIconClick} />
                    <div className='star-text'>축제 후기</div>
                </div>
                <div className='chat-button' onClick={toggleChatModal}>
                    <img src={chatIcon} alt='채팅 아이콘' className='chat-icon' />
                    <div className='chat-text'>채팅</div>
                </div>
                <div className='setting-button' onClick={toggleSettingModal}>
                    <img src={settingIcon} alt='설정 아이콘' className='setting-icon' />
                    <div className='setting-text'>설정</div>
                </div>
            </div>
            <Modal
                isOpen={isHeartModalOpen}
                onRequestClose={toggleHeartModal}
                style={modalStyle}
                contentLabel='찜 목록'
            >
                <h2 className='favorite-list-title'>나의 찜 목록</h2>
                <div className='favorite-list'>
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className='favorite-item'>
                            {/* 여기에 각 찜 목록 항목의 내용을 출력 */}
                            <span onClick={() => handleFestivalTitleClick(favorite.contentId)}>{favorite.title}</span>
                            <div>{formatDate(favorite.startDate)} ~ {formatDate(favorite.endDate)}</div>
                        </div>
                    ))}
                </div>
                <button className='board-list-close-botton' onClick={toggleHeartModal}>닫기</button>
            </Modal>
            <Modal
                isOpen={isBoardModalOpen}
                onRequestClose={toggleBoardModal}
                style={modalStyle}
                contentLabel='내 게시물'
            >
                <h2>내 게시물</h2>
                <div className='board-list'>
                    {boardList.map((board) => (
                        <div key={board.meetingBoardId} className='board-item'>
                            <div onClick={() => handleBoardTitleClick(board.meetingBoardId, board.meetingId)}>{board.title}</div>
                            {/* <div>{board.content}</div> */}
                            {/* 이미지가 있다면 출력 */}
                            {/* {board.imageList && board.imageList.length > 0 && (
                                <img src={board.imageList[0].image} alt='게시물 이미지' className='board-image' />
                            )} */}
                        </div>
                    ))}
                </div>
                <button className='board-list-close-botton' onClick={toggleBoardModal}>닫기</button>
            </Modal>
            <Modal
                isOpen={isChatModalOpen}
                onRequestClose={toggleChatModal}
                style={modalStyle}
                contentLabel='채팅'
            >
                <div className='chat-list'>
                    {chatRooms.map((chatRoom) => {
                        const otherUser = loginUser?.nickname === chatRoom.creator.nickname ? chatRoom.user : chatRoom.creator;
                        const profileImage = otherUser?.profileImage ? otherUser.profileImage : defaultProfileImage;
                        const formattedLastMessage = chatRoom.lastMessage
                            ? `${chatRoom.lastMessage} (${new Date(chatRoom.lastMessageTimestamp).toLocaleString()})`
                            : '최근 메세지가 없습니다.';

                        return (
                            <div key={chatRoom.roomId} className='favorite-item'>
                                <span onClick={() => handleChatRoomClick(chatRoom.roomId, loginUser?.userId || '')}>
                                    <img src={profileImage} alt="프로필 이미지" className='board-list-profile-image' />
                                    {otherUser?.nickname}
                                    <p className='last-message'>{formattedLastMessage}</p>
                                </span>
                            </div>
                        );
                    })}
                </div>
                <button className='board-list-close-botton' onClick={toggleChatModal}>닫기</button>
            </Modal>
            <Modal
                isOpen={isGroupModalOpen}
                onRequestClose={toggleGroupModal}
                style={modalStyle}
                contentLabel='내 모임'
            >
                <h2>내 모임 목록</h2>
                <div className='meeting-list'>
                    {meetingList.map((meeting) => (
                        <div key={meeting.meetingId} className='meeting-item' onClick={() => handleMeetingTitleClick(meeting.meetingId)}>
                            {/* 여기에 각 모임 목록 항목의 내용을 출력 */}
                            <img src={meeting.creatorProfileImage ? meeting.creatorProfileImage : defaultProfileImage} alt="profile" className='board-list-profile-image' />
                            <div>{meeting.creatorNickname}</div>
                            <span>{meeting.title}</span>
                        </div>
                    ))}
                </div>
                <button className='board-list-close-botton' onClick={toggleGroupModal}>닫기</button>
            </Modal>
            <Modal
                isOpen={isPasswordModalOpen}
                onRequestClose={togglePasswordModal}
                style={passwordModalStyle}
                contentLabel='비밀번호 확인'
            >
                <h2>비밀번호 확인</h2>
                <input
                    type='password'
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder='비밀번호 입력'
                />
                {passwordError && <div className='error'>{passwordError}</div>}
                <button onClick={handlePasswordSubmit}>확인</button>
                <button onClick={togglePasswordModal}>취소</button>
            </Modal>
            <Modal
                isOpen={isSettingModalOpen}
                onRequestClose={toggleSettingModal}
                style={modalStyle}
                contentLabel='설정'
            >
                <h2>설정</h2>
                <div onClick={handleProfileChangeClick}>프로필 변경</div>
                <div>
                    <label>
                        알림
                        <Switch onChange={handleNotificationChange} checked={isNotificationEnabled} />
                    </label>
                </div>
                <div onClick={handleLogoutClick} >로그아웃</div>
                <button onClick={toggleSettingModal}>닫기</button>
            </Modal>
        </div>
    );
}
