import { DeleteMeetingRequest, GetJoinMeetingMemberRequest, GetMeetingBoardListRequest, GetMeetingRequest, GetMeetingRequests, PostChatRoomRequest, PostJoinMeetingRequest, PostRespondToJoinRequest } from 'apis/apis';
import defaultProfileImage from 'assets/images/user.png';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Meeting, MeetingBoard, MeetingRequest } from 'types/interface/interface';
import './style.css';

Modal.setAppElement('#root');

const ModalStyle = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

export default function MeetingDetail() {

    const { loginUser } = useLoginUserStore();
    const { meetingId } = useParams<{ meetingId: string }>()
    const [meeting, setMeeting] = useState<Meeting>()
    const [cookies, setCookie] = useCookies();
    const [userId, setUserId] = useState<string>('');
    const [role, setRole] = useState<string>('')
    const [nickname, setNickname] = useState<string>('');
    const [profileImages, setProfileImages] = useState<string[]>([]);
    const [requests, setRequests] = useState<MeetingRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const creatorNickname = meeting?.userNickname;
    const roomName = meeting?.userNickname;
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('detail');
    const [joinMemberList, setJoinMemberList] = useState<string[]>([]);
    const [joinMembers, setJoinMembers] = useState<number>();
    const [boardList, setBoardList] = useState<MeetingBoard[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        if (loginUser) {
            setNickname(loginUser.nickname)
            setUserId(loginUser.userId)
            setRole(loginUser.role)
        }
    }, [])

    useEffect(() => {
        if (!meeting) return;

        const fetchJoinMembers = async () => {
            try {
                const response = await GetJoinMeetingMemberRequest(meeting.meetingId, cookies.accessToken);
                if (!response) return;
                const members = response.meetingUsersList.map(member => member.userNickname);
                setJoinMemberList(members);
                setJoinMembers(response.meetingUsersList.length);
            } catch (error) {
                console.error('Failed to fetch join members:', error);
            }
        };
        fetchJoinMembers();
    }, [meeting, cookies.accessToken]);


    useEffect(() => {
        if (!meetingId) return;
        const getMeeting = async () => {
            try {
                const response = await GetMeetingRequest(meetingId)
                if (!response) return;
                setMeeting(response.meeting)
            }
            catch (error) {
                console.error("모임 정보를 불러오는 중 오류가 발생했습니다:", error)
            }
        }
        getMeeting()
    }, [meetingId])

    useEffect(() => {
        if (!meetingId) return;
        const fetchBoardList = async () => {
            const response = await GetMeetingBoardListRequest(meetingId);
            if (response && response.code === 'SU') {
                setBoardList(response.meetingBoardList);
            } else {
                console.error('Failed to fetch board list:');
            }
        }
        fetchBoardList();
    }, [meetingId])

    const formatDate = (createDateTime: string) => {
        const isoDate = createDateTime;
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        let period = hours < 12 ? '오전' : '오후';
        if (hours === 0) {
            hours = 12;
        } else if (hours > 12) {
            hours -= 12;
        }
        return `${year}.${month}.${day}. ${period} ${hours}:${minutes}`;
    };

    const handleCreateRoom = async () => {
        const meetingTitle = meeting?.title;
        if (!roomName || !nickname || !creatorNickname || !meetingTitle) return;
        try {
            const response = await PostChatRoomRequest({ userId, roomName, nickname, creatorNickname, meetingTitle }, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                const roomId = response.roomId;
                if (roomId) {
                    navigate(`/chat?roomId=${roomId}&userId=${creatorNickname}`);
                } else {
                    console.error('Failed to create chat room: No roomId returned');
                }
            } else {
                console.error('Failed to create chat room:', response.message);
            }
        } catch (error) {
            console.error('Failed to create chat room:', error);
        }
    };

    const handleJoinMeeting = async () => {
        if (!meetingId || !nickname) return;
        const isAlreadyJoined = joinMemberList.includes(nickname);
        if (isAlreadyJoined) {
            alert('이미 모임에 가입된 멤버입니다.');
            return;
        }
        try {
            const response = await PostJoinMeetingRequest({ meetingId: Number(meetingId), nickname }, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                alert('모임에 가입 신청이 완료되었습니다.');
            }
            if (response.code === "AR") {
                alert("이미 가입 신청이 되었습니다.")
            }
            else {
                console.error('Failed to join meeting:', response.message);
            }
        } catch (error) {
            console.error('Failed to join meeting:', error);
        }
    }

    const handleRequestResponse = async (requestId: number, status: boolean) => {
        try {
            console.log(requestId, status);
            const response = await PostRespondToJoinRequest(requestId, status, cookies.accessToken);
            if (!response) return;
            const { code } = response;
            if (code === 'SU') {
                alert('요청이 처리되었습니다.');
                setRequests(prevRequests => prevRequests.filter(request => request.requestId !== requestId));
            } else {
                console.error('Failed to respond to join request:', response.message);
            }
        } catch (error) {
            console.error('Failed to respond to join request:', error);
        }
    }

    useEffect(() => {
        if (!meetingId) return;
        const fetchRequests = async () => {
            try {
                const response = await GetMeetingRequests(meetingId, cookies.accessToken);
                if (!response) return;
                setRequests(response.requests);
                if (response.code === 'SU') {
                    setRequests(response.requests);
                    const images: string[] = response.requests.map(request => request.user?.profileImage || '');
                    setProfileImages(images);
                }
            } catch (error) {
                console.error('Failed to fetch meeting requests:', error);
            }
        }
        fetchRequests();
    }, [meetingId]);


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const backGoPathClickHandler = () => {
        navigate(`/meeting/list`);
    }

    // 이미지 넘기기 함수
    const nextImage = () => {
        if (meeting && meeting.imageList) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % meeting.imageList.length);
        }
    };
    
    const prevImage = () => {
        if (meeting && meeting.imageList) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + meeting.imageList.length) % meeting.imageList.length);
        }
    };
    
    const toggleOptions = () => {
        setShowOptions((prev) => !prev);
    };
    

    // 수정
    const updatePostClickHandler = (meetingId: number | string | undefined) => {
        if (!meetingId) return;
        navigate(`/meeting/update/${meetingId}`);
    };

    // 삭제
    const deleteMeetingButtonClickHandler = async (meetingId: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteMeetingRequest(meetingId, cookies.accessToken);
        if (response) {
            if (response.code === 'SU') {
                alert('모임이 삭제되었습니다.');
                navigate('/meeting/list');
            }
            if (response.code !== 'SU') {
                alert('모임 삭제에 실패했습니다.');
            } else {
                console.error('Failed to delete meeting:', response.message);
            }
        }
    }


    const handleCreateBoard = () => {
        navigate(`/meeting/board/write/${meetingId}`);
    }

    const handleBoardDetail = (meetingBoardId: string) => {
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    }

    if (!meeting) return <div>모임 정보를 불러오는 중입니다...</div>;
    return (
        <div className="meeting-detail-container">
            <div className='meeting-detail-header'>
                <div className='meeting-detail-name'>
                    <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backGoPathClickHandler} />
                    <h1>{meeting.title}</h1>
                </div>
                <img className='meeting-detail-sharing' src="https://i.imgur.com/hA50Ys8.png" alt="공유" onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('링크가 복사되었습니다!'); // 성공 메시지
                    } catch (err) {
                        console.error('링크 복사 실패:', err);
                    }
                }} />
            </div>
    
            <div className="tab-menu">
                <button className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`} onClick={() => setActiveTab('detail')}>모임 홈</button>
                <button className={`tab-button ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>게시판</button>
                <button className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>사진첩</button>
            </div>

    
            <div className="meeting-detail-body">
                {activeTab === 'detail' && (
                    <div>
                        <div className="meeting-detail-in">
                            <div className="meeting-detail-left">
                                <div className="carousel">
                                    {meeting.imageList?.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.image}
                                            alt={`Meeting image ${index + 1}`}
                                            className={currentIndex === index ? 'active' : ''}
                                        />
                                    ))}
                                    <button className="carousel-button left" onClick={prevImage}>◀</button>
                                    <button className="carousel-button right" onClick={nextImage}>▶</button>
                                </div>
                            </div>
                            <div className="meeting-detail-right">
                                <div className="more-options">
                                    {(meeting.userNickname === nickname || role === "ADMIN") && (
                                        <img className="more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
                                    )}
                                    {showOptions && (
                                        <div className="button-box">
                                        {meeting.userNickname === nickname && (
                                            <button
                                            className="update-button"
                                            onClick={() => updatePostClickHandler(meeting.meetingId)}
                                            >
                                            수정
                                            </button>
                                        )}
                                        {(meeting.userNickname === nickname || role === "ADMIN") && (
                                            <button
                                            className="delete-button"
                                            onClick={() => deleteMeetingButtonClickHandler(meeting.meetingId)}
                                            >
                                            삭제
                                            </button>
                                        )}
                                        </div>
                                    )}
                                </div>
                                <p>대표 닉네임</p>
                                <div className="bordered-div">{meeting.userNickname}</div>
                                <p>한 줄 소개</p>
                                <div className="bordered-div">{meeting.introduction}</div>
                                <p>개설 날짜</p>
                                <div className="bordered-div">{formatDate(meeting.createDate)}</div>
                                <p>활동 지역</p>
                                <div className="bordered-div">
                                    {Array.isArray(meeting.locations) ? meeting.locations.join(', ') : meeting.locations}
                                </div>
                                <p>인원</p>
                                <div className="bordered-div">{joinMembers}/{meeting.maxParticipants}</div>
                                <div className='meeting-detail-btn'>
                                    <button onClick={handleCreateRoom}>1 : 1 채팅</button>
                                    {joinMemberList.includes(nickname) ? (
                                        <div></div>) : (
                                        <button onClick={handleJoinMeeting} style={{ display: nickname === creatorNickname ? 'none' : 'inline-block' }}>가입 신청</button>)}
                                    {nickname === creatorNickname && (
                                        <button onClick={openModal}>신청 목록</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="meeting-detail-description">
                            <p>모임 설명</p>
                            <div className="meeting-detail-content">
                                <div>{meeting.content}</div>
                                <div className="meeting-tags">
                                    {meeting.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'participants' && (
                    <div className="participants-list">
                        <div className='meeting-board-list'>
                            <button className='meeting-board-add-btn' onClick={handleCreateBoard}>{"게시물 작성"}</button>

                            <div className='meeting-board-header'>
                            <div className='header-item'>프로필 사진</div>
                            <div className='header-item'>닉네임</div>
                            <div className='header-item'>제목</div>
                            <div className='header-item'>작성 날짜</div>
                            </div>
                            {boardList.length === 0 ? (
                                <div className="no-posts-message">게시물이 없습니다.</div>
                            ) : (
                                <div className='board-list-content'>
                                    {boardList.map((board) => (
                                        <div key={board.meetingBoardId} className='meeting-board-item' onClick={() => handleBoardDetail(board.meetingBoardId)}>
                                            <img
                                                src={board.userDto && board.userDto.profileImage ? board.userDto.profileImage : defaultProfileImage}
                                                alt="profile"
                                                className='board-list-profile-image'
                                            />
                                            <div className='item-nickname'>{board.userDto ? board.userDto.nickname : 'Unknown'}</div>
                                            <div className='item-title'>{board.title}</div>
                                            <div className='item-date'>{board.createDate}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'requests' && (
                    <div className="requests-list">
                        <h2>사진첩</h2>
                    </div>
                )}
            </div>
            
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="신청 목록"
                style={ModalStyle}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>참가 요청 목록</h2>
                    </div>
                    <div className="modal-body">
                        {requests.length > 0 ? (
                            requests.map((request, index) => (
                                <div key={request.requestId} className="request-item">
                                    <div className="profile-info">
                                        <img
                                            src={profileImages[index] || defaultProfileImage}
                                            alt="profile"
                                        />
                                        <p>{request.user?.nickname || "Unknown User"}</p>
                                    </div>
                                    <p>요청 날짜: {new Date(request.requestDate).toLocaleString()}</p>
                                    <div className="request-buttons">
                                        <button onClick={() => handleRequestResponse(request.requestId, true)}>수락</button>
                                        <button onClick={() => handleRequestResponse(request.requestId, false)}>거절</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>참가 요청이 없습니다.</p>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button onClick={closeModal}>닫기</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}