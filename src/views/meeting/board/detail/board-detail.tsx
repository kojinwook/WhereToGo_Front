import { DeleteMeetingBoardRequest, GetMeetingBoardRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MeetingBoard } from 'types/interface/interface';
import defaultProfileImage from 'assets/images/user.png';
import { useCookies } from 'react-cookie';

export default function BoardDetail() {

    const { meetingId } = useParams();
    const { meetingBoardId } = useParams();
    const [board, setBoard] = useState<MeetingBoard>();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string>("");
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!meetingBoardId) return;
        const fetchBoard = async () => {
            const response = await GetMeetingBoardRequest(meetingBoardId);
            if (!response) return;
            if (response && response.code === 'SU') {
                setBoard(response.meetingBoard);
                setProfileImage(response.meetingBoard.userDto.profileImage);
                setNickname(response.meetingBoard.userDto.nickname);
            } else {
                console.error('Failed to fetch board');
            }
        }
        fetchBoard();
    }, [])

    const onUpdateBoardButtonClickHandler = () => {
        navigate(`/meeting/board/update/${meetingBoardId}`);
    }

    const deleteBoardButtonClickHandler = async () => {
        if(!meetingBoardId) return;
        const response = await DeleteMeetingBoardRequest(meetingBoardId, cookies.accessToken);
        if(!response) return;
        if (response && response.code === 'SU') {
            alert('게시물이 삭제되었습니다.');
            navigate(`/meeting/board/list/${meetingId}`);
        }
        if(response.code === 'DHP'){
            alert('게시물을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete board');
        }
    }

    return (
        <div>
            <h1>Board Detail</h1>
            {board && (
                <div>
                    프로필이미지: <img src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' className='' />
                    <p>닉네임: {nickname}</p>
                    <ul>사진:
                        {board.imageList.map((image, index) => (
                            <li key={index}>
                                <img src={image.image} alt="image" />
                            </li>
                        ))}
                    </ul>
                    <p>제목: {board.title}</p>
                    <p>주소: {board.address}</p>
                    <p>내용: {board.content}</p>
                </div>
            )}
        </div>
    )
}
