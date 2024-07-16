import { GetMeetingRequest, PostChatRoomRequest, PostJoinMeetingRequest } from 'apis/apis'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom'
import useLoginUserStore from 'store/login-user.store';
import { Meeting } from 'types/interface/interface'

export default function MeetingDetail() {

    const { loginUser } = useLoginUserStore();
    const { meetingId } = useParams<{ meetingId: string }>()
    const [meeting, setMeeting] = useState<Meeting>()
    const [cookies, setCookie] = useCookies();
    const [userId, setUserId] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
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
                console.log(response)
                setMeeting(response.meeting)
            }
            catch (error) {
                console.error("모임 정보를 불러오는 중 오류가 발생했습니다:", error)
            }
        }
        getMeeting()
    }, [meetingId])

    const handleCreateRoom = async () => {
        const meetingTitle = meeting?.title;
        if (!roomName || !nickname || !creatorNickname || !meetingTitle) return;
        try {
            const response = await PostChatRoomRequest({ userId, roomName, nickname, creatorNickname, meetingTitle }, cookies.access_token);
            console.log(response);
            if (response.code === 'SU') {
                const roomId = response.roomId;
                if (roomId) {
                    navigate(`/chat?roomId=${roomId}&userId=${userId}`);
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
            const response = await PostJoinMeetingRequest({ meetingId: Number(meetingId), nickname }, cookies.access_token);
            console.log(response);
            if (response.code === 'SU') {
                alert('모임에 가입되었습니다.');
            } else {
                console.error('Failed to join meeting:', response.message);
            }
        } catch (error) {
            console.error('Failed to join meeting:', error);
        }
    }

    if (!meeting) return <div>모임 정보를 불러오는 중입니다...</div>;
    return (
        <div>
            <h1>모임명: {meeting.title}</h1>
            <p>한줄소개: {meeting.introduction}</p>
            <p>모임설명: {meeting.content}</p>
            <p>개설날짜: {meeting.createDate}</p>
            {/* <p>{meeting.modifyDate}</p> */}
            <p>인원: {meeting.maxParticipants}</p>
            <p>대표닉네임: {meeting.userNickname}</p>
            <button onClick={handleCreateRoom}>1 : 1 채팅</button>
            <button onClick={handleJoinMeeting}>모임 참가</button>
        </div>
    )
}
