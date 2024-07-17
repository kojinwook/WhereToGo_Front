import { GetMeetingRequest, GetMeetingRequests, PostChatRoomRequest, PostJoinMeetingRequest, PostRespondToJoinRequest } from 'apis/apis'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom'
import useLoginUserStore from 'store/login-user.store';
import { Meeting, MeetingRequest } from 'types/interface/interface'
import defaultProfileImage from 'assets/images/user.png';
import Modal from 'react-modal'

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
    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [requests, setRequests] = useState<MeetingRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const creatorNickname = meeting?.userNickname;
    const roomName = meeting?.userNickname;
    const navigate = useNavigate();

    useEffect(() => {
        if (loginUser) {
            setNickname(loginUser.nickname)
            setUserId(loginUser.userId)
        }
    }, [])

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
        try {
            const response = await PostJoinMeetingRequest({ meetingId: Number(meetingId), nickname }, cookies.accessToken);
            if (!response) return;
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

    if (!meeting) return <div>모임 정보를 불러오는 중입니다...</div>;
    return (
        <div>
            <h1>모임명: {meeting.title}</h1>
            <p>한줄소개: {meeting.introduction}</p>
            <p>모임설명: {meeting.content}</p>
            <p>개설날짜: {formatDate(meeting.createDate)}</p>
            <p>인원: {meeting.maxParticipants}</p>
            <p>대표닉네임: {meeting.userNickname}</p>
            <p>태그: {meeting.tags.join(', ')}</p>
            <p>지역: {meeting.areas.join(', ')}</p>
            <p>모임 이미지</p>
            <div>
                {meeting.imageList?.map((image, index) => (
                    <img key={index} src={image.image} alt={`Meeting image ${index + 1}`} />
                ))}
            </div>
            <button onClick={handleCreateRoom}>1 : 1 채팅</button>
            <button onClick={handleJoinMeeting} style={{ display: nickname === creatorNickname ? 'none' : 'inline-block' }}>가입 신청</button>
            {nickname === creatorNickname && (
                <button onClick={openModal}>신청 목록</button>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="신청 목록"
                style={ModalStyle}
            >
                <h2>참가 요청 목록</h2>
                {requests.length > 0 ? (
                    requests.map(request => (
                        <div key={request.requestId}>
                            <div className="profile-info">
                                    <img src={profileImage ? profileImage : defaultProfileImage} alt="profile" />
                                </div>
                            <p>{request.user.nickname}</p>
                            <p>요청 날짜: {new Date(request.requestDate).toLocaleString()}</p>
                            <button onClick={() => handleRequestResponse(request.requestId, true)}>수락</button>
                            <button onClick={() => handleRequestResponse(request.requestId, false)}>거절</button>
                        </div>
                    ))
                ) : (
                    <p>참가 요청이 없습니다.</p>
                )}
                <button onClick={closeModal}>닫기</button>
            </Modal>
        </div>
    )
}
