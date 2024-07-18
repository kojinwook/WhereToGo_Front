import { GetMeetingBoardListRequest } from 'apis/apis';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MeetingBoard from 'types/interface/meeting-board.interface';
import defaultProfileImage from 'assets/images/user.png';

export default function BoardList() {

    const { meetingId } = useParams();
    const [boardList, setBoardList] = useState<MeetingBoard[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!meetingId) return;
        const fetchBoardList = async () => {
            const response = await GetMeetingBoardListRequest(meetingId);
            console.log(response?.meetingBoardList.map((board) => board.imageList));
            if (response && response.code === 'SU') {
                setBoardList(response.meetingBoardList);

            } else {
                console.error('Failed to fetch board list:');
            }
        }
        fetchBoardList();
    }, [])

    const handleCreateBoard = () => {
        navigate(`/meeting/board/write/${meetingId}`);
    }

    const handleBoardDetail = (meetingBoardId: string) => {
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    }

    return (
        <div>
            <h1>Board List</h1>
            <button onClick={handleCreateBoard}>{"게시물 작성"}</button>
            <ul>
                {boardList.map((board) => (
                    <li key={board.meetingBoardId}>
                        프로필이미지: <img
                            src={board.userDto.profileImage || defaultProfileImage}
                            alt="profile"
                        />
                        <h2>제목: {board.title}</h2>
                        <p>{board.content}</p>
                        <p>닉네임: {board.userDto.nickname}</p>
                        <p>작성날짜: {board.createDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
