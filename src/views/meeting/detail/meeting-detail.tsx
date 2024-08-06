import { DeleteMeetingRequest, DislikeUserRequest, GetJoinMeetingMemberRequest, GetMeetingBoardImageListRequest, GetMeetingBoardListRequest, GetMeetingRequest, GetMeetingRequests, LikeUserRequest, PostChatRoomRequest, PostJoinMeetingRequest, PostRespondToJoinRequest } from 'apis/apis';
import moreButton from 'assets/images/more.png';
import defaultProfileImage from 'assets/images/user.png';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Images, Meeting, MeetingBoard, MeetingRequest, MeetingUser } from 'types/interface/interface';
import './style.css';
import Pagination from 'components/Pagination';

Modal.setAppElement('#root');

export default function MeetingDetail() {

    const { loginUser } = useLoginUserStore();
    const { meetingId } = useParams<{ meetingId: string }>();
    const [meeting, setMeeting] = useState<Meeting>();
    const [cookies] = useCookies();
    const [userId, setUserId] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [creatorId, setCreatorId] = useState<string>('');
    const [creatorNickname, setCreatorNickname] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [profileImages, setProfileImages] = useState<string[]>([]);
    const [requests, setRequests] = useState<MeetingRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('detail');
    const [joinMemberList, setJoinMemberList] = useState<MeetingUser[]>([]);
    const [joinMembers, setJoinMembers] = useState<number>();
    const [boardList, setBoardList] = useState<MeetingBoard[]>([]);
    const [boardImageList, setBoardImageList] = useState<Images[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = boardList.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(boardList.length / itemsPerPage);
    const viewPageList = Array.from({ length: pageCount }, (_, i) => i + 1);


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
                console.log(response)
                const members = response.meetingUsersList.map(member => member.userNickname);
                setJoinMemberList(response.meetingUsersList);
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
                setCreatorNickname(response.meeting.userDto.nickname)
                setCreatorId(response.meeting.userDto.userId)
                setRoomName(response.meeting.userDto.nickname)
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

    useEffect(() => {
        if (!meetingId) return;
        const fetchMeetingBoardImageList = async () => {
            const response = await GetMeetingBoardImageListRequest(meetingId);
            console.log("response", response)
            if (response && response.code === 'SU') {
                setBoardImageList(response.imageList);
            } else {
                console.error('Failed to fetch board list:');
            }
        }
        fetchMeetingBoardImageList();
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
        if (!cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!roomName || !nickname || !creatorId || !meetingTitle) return;
        try {
            const response = await PostChatRoomRequest({ userId, roomName, nickname, creatorId, meetingTitle }, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                const roomId = response.roomId;
                if (roomId) {
                    navigate(`/chat?roomId=${roomId}&userId=${creatorId}`);
                } else {
                    console.error('Failed to create chat room: No roomId returned');
                }
            } else {
                console.error('Failed to create chat room:');
            }
        } catch (error) {
            console.error('Failed to create chat room:', error);
        }
    };

    const handleJoinMeeting = async () => {
        if (!meetingId || !nickname) return;
        if (!cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }
        const isAlreadyJoined = joinMemberList.map(member => member.userNickname).includes(nickname);
        if (isAlreadyJoined) {
            alert('이미 모임에 가입된 멤버입니다.');
            return;
        }
        if (joinMembers === meeting?.maxParticipants) {
            alert('모임 인원이 꽉 찼습니다.');
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
                console.error('Failed to join meeting:');
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
                console.error('Failed to respond to join request:');
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
                console.error('Failed to delete meeting:');
            }
        }
    }

    const handleCreateBoard = () => {
        navigate(`/meeting/board/write/${meetingId}`);
    }

    const handleBoardDetail = (meetingBoardId: string) => {
        if (!joinMemberList.map(member => member.userNickname).includes(nickname)) {
            alert('모임에 가입해야 게시물을 볼 수 있습니다.');
            return;
        }
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    }

    // 멤버 리스트
    const toggleMemberModal = () => {
        setIsMemberModalOpen(!isMemberModalOpen);
    };

    const handleLike = async (nickname: string) => {
        window.confirm('정말로 좋아요를 누르시겠습니까?')
        if (!meetingId || !nickname) return;
        const response = await LikeUserRequest(nickname, meetingId, cookies.accessToken);
        if (response) {
            if (response.code === 'SU') {
                alert('좋아요를 눌렀습니다.');
            }
            if (response.code === 'AR') {
                alert('이미 좋아요를 눌렀습니다.');
            }
        }
    }

    const handleUnlike = async (nickname: string) => {
        window.confirm('정말로 싫어요를 누르시겠습니까?')
        if (!meetingId || !nickname) return;
        const response = await DislikeUserRequest(nickname, meetingId, cookies.accessToken);
        console.log(response);
        if (response) {
            if (response.code === 'SU') {
                alert('싫어요를 눌렀습니다.');
            }
            if (response.code === 'AR') {
                alert('이미 싫어요를 눌렀습니다.');
            }
        }
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
                        alert('링크가 복사되었습니다!'); 
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
                                <div className="meeting-more-options">
                                    {(meeting.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                        <img className="meeting-more-button" src={moreButton} alt="더보기" onClick={toggleOptions} />
                                    )}
                                    {showOptions && (
                                        <div className="button-box">
                                            {meeting.userDto.nickname === nickname && (
                                                <button
                                                    className="update-button"
                                                    onClick={() => updatePostClickHandler(meeting.meetingId)}
                                                >
                                                    수정
                                                </button>
                                            )}
                                            {(meeting.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
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
                                <div className="bordered-div">{creatorNickname}</div>
                                <p>한 줄 소개</p>
                                <div className="bordered-div">{meeting.introduction}</div>
                                <p>개설 날짜</p>
                                <div className="bordered-div">{formatDate(meeting.createDate)}</div>
                                <p>활동 지역</p>
                                <div className="bordered-div">
                                    {Array.isArray(meeting.locations) ? meeting.locations.join(', ') : meeting.locations}
                                </div>
                                <p className='meeting-member'>인원</p>
                                <div>
                                    <div className="bordered-div member" onClick={toggleMemberModal}>
                                        {joinMembers}/{meeting.maxParticipants}
                                    </div>

                                    {isMemberModalOpen && (
                                        <div className="meeting-member-modal">
                                            <div className="member-modal-content">
                                                <button className="member-modal-close" onClick={toggleMemberModal}>
                                                    X
                                                </button>
                                                <div>
                                                    {joinMemberList.map((member, index) => (
                                                        <div key={index} className="participant">
                                                            <img
                                                                src={member.userProfileImage || defaultProfileImage}
                                                                alt="profile"
                                                            />
                                                            <p>{member.userNickname}</p>
                                                            <button onClick={() => handleLike(member.userNickname)}>{'좋아요'}</button>
                                                            <button onClick={() => handleUnlike(member.userNickname)}>{'싫어요'}</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='meeting-detail-btn'>
                                    <button onClick={handleCreateRoom}>1 : 1 채팅</button>
                                    {joinMemberList.map(member => member.userNickname).includes(nickname) ? (
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
                            <button className='meeting-board-add-btn' onClick={handleCreateBoard}>게시물 작성</button>
                            <div className='meeting-board-header'>
                                <div className='header-item'>프로필 사진</div>
                                <div className='header-item'>닉네임</div>
                                <div className='header-item'>제목</div>
                                <div className='header-item'>작성 날짜</div>
                            </div>
                            {currentItems.length === 0 ? (
                                <div className="no-posts-message">게시물이 없습니다.</div>
                            ) : (
                                <div className='board-list-content'>
                                    {currentItems.map((board) => (
                                        <div key={board.meetingBoardId} className='meeting-board-item' onClick={() => handleBoardDetail(board.meetingBoardId)}>
                                            <div className='item-img'>
                                                <img
                                                    src={board.userDto && board.userDto.profileImage ? board.userDto.profileImage : defaultProfileImage}
                                                    alt="profile"
                                                    className='board-list-profile-image'
                                                />
                                            </div>
                                            <div className='item-nickname'>{board.userDto ? board.userDto.nickname : 'Unknown'}</div>
                                            <div className='item-title'>{board.title}</div>
                                            <div className='item-date'>{formatDate(board.createDate)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                viewPageList={viewPageList}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="requests-list">
                        <div className='image-grid'>
                            {boardImageList.map((image) => (
                                <div key={image.imageId} className="image-container">
                                    <img src={image.image} alt="image" className="board-image" onClick={() => handleBoardDetail(image.meetingBoardId)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="신청 목록"
                className="meeting-modal"
            >
                <div className="modal-content">
                    <div className="modal-footer">
                        <button className='modal-x' onClick={closeModal}>X</button>
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
                </div>
            </Modal>
            <div>
                <div>
                    {joinMemberList.map((member, index) => (
                        <div key={index} className="participant">
                            <img
                                src={member.userProfileImage || defaultProfileImage}
                                alt="profile"
                            />
                            <p>{member.userNickname}</p>
                            <button onClick={() => handleLike(member.userNickname)}>{'좋'}</button>
                            <button onClick={() => handleUnlike(member.userNickname)}>{'싫'}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}