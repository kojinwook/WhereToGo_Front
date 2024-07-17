import { GetMeetingRequest, GetMeetingRequests, PostChatRoomRequest, PostJoinMeetingRequest, PostRespondToJoinRequest } from 'apis/apis';
import defaultProfileImage from 'assets/images/user.png';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Meeting, MeetingRequest } from 'types/interface/interface';
import './style.css';
import { ResponseDto } from 'apis/response/response';

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
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [requests, setRequests] = useState<MeetingRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const creatorNickname = meeting?.userNickname;
    const roomName = meeting?.userNickname;
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('detail');

    const [deletingMeetingId, setDeletingMeetingId] = useState<number | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        if (loginUser) {
            setNickname(loginUser.nickname)
            setUserId(loginUser.userId)
            setRole(loginUser.role)
        }
    }, [])

    useEffect(() => {
        if (!meetingId) return;
        const getMeeting = async () => {
            try {
                const response = await GetMeetingRequest(meetingId)
                console.log(response)
                setMeeting(response.meeting)
            }
            catch (error) {
                console.error("모임 정보를 불러오는 중 오류가 발생했습니다:", error)
            }
        }
        getMeeting()
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
            console.log(response);
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
        try {
            const response = await PostJoinMeetingRequest({ meetingId: Number(meetingId), nickname }, cookies.accessToken);
            const { code } = response;
            if (code === 'SU') {
                alert('모임에 가입 신청이 완료되었습니다.');
            }
            if (code === "AR") {
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
            console.log(response);
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
                console.log(response);
                setRequests(response.requests);
                setProfileImage(response.requests[0].user.profileImage);
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

    const backgoPathClickHandler = () => {
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
    const deletePostClickHandler = (meetingId: number | string | undefined) => {
        if (!window.confirm("삭제하시겠습니까?")) {
        return;
    }
    if (!meetingId) {
        alert("해당 문의가 없습니다.");
        return;
    }
        // DeleteMeetingRequest(meetingId).then(deleteMeetingResponse);
    };

    // const deleteMeetingResponse = (
    //     responseBody: DeleteMeetingResponseDto | ResponseDto | null
    // ) => {
    // if (responseBody && responseBody.code === "SU") {
    //     alert("해당 문의가 삭제되었습니다.");
    //     navigate("/meeting/list");
    // } else {
    //     alert("삭제 실패");
    // }
    // setDeletingMeetingId(null);
    // };
    

    if (!meeting) return <div>모임 정보를 불러오는 중입니다...</div>;
    return (
        <div className="meeting-detail-container">
            <div className='meeting-detail-header'>
                <div className='meeting-detail-name'>
                    <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backgoPathClickHandler} />
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
                <button className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`} onClick={() => setActiveTab('detail')}>모임 상세</button>
                <button className={`tab-button ${activeTab === 'participants' ? 'active' : ''}`} onClick={() => setActiveTab('participants')}>참가자 목록</button>
                <button className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>신청 목록</button>
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
                                            onClick={() => deletePostClickHandler(meeting.meetingId)}
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
                                <p>인원</p>
                                <div className="bordered-div">/{meeting.maxParticipants}</div>
                                <div className='meeting-detail-btn'>
                                    <button onClick={handleCreateRoom}>1 : 1 채팅</button>
                                    <button onClick={handleJoinMeeting} style={{ display: nickname === creatorNickname ? 'none' : 'inline-block' }}>가입 신청</button>
                                    {nickname === creatorNickname && (
                                        <button onClick={openModal}>신청 목록</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="meeting-detail-description">
                            <h2>모임 설명</h2>
                            <p>{meeting.content}</p>
                            <p>개설날짜: {formatDate(meeting.createDate)}</p>
                            <p>태그: {meeting.tags}</p>
                            <p>지역: {meeting.areas}</p>
                        </div>
                    </div>
                )}
                {activeTab === 'participants' && (
                    <div className="participants-list">
                        {/* 참가자 목록을 여기에 추가 */}
                        <h2>참가자 목록</h2>
                        {/* 참가자 데이터 표시 */}
                    </div>
                )}
                {activeTab === 'requests' && (
                    <div className="requests-list">
                        {/* 신청 목록을 여기에 추가 */}
                        <h2>신청 목록</h2>
                        {/* 신청 요청 데이터 표시 */}
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
                        <button onClick={closeModal}>닫기</button>
                    </div>
                    <div className="modal-body">
                        {requests.length > 0 ? (
                            requests.map(request => (
                                <div key={request.requestId}>
                                    <div className="profile-info">
                                        <img src={profileImage ? profileImage : defaultProfileImage} alt="profile" />
                                        <p>{request.user.nickname}</p>
                                    </div>
                                    <p>요청 날짜: {new Date(request.requestDate).toLocaleString()}</p>
                                    <button onClick={() => handleRequestResponse(request.requestId, true)}>수락</button>
                                    <button onClick={() => handleRequestResponse(request.requestId, false)}>거절</button>
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