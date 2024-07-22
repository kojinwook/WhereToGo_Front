import { GetMeetingBoardListRequest } from 'apis/apis';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MeetingBoard from 'types/interface/meeting-board.interface';
import defaultProfileImage from 'assets/images/user.png';
import './style.css';

export default function BoardList() {

    const { meetingId } = useParams();
    const [boardList, setBoardList] = useState<MeetingBoard[]>([]);
    const navigate = useNavigate();

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
    }, [])

    const handleCreateBoard = () => {
        navigate(`/meeting/board/write/${meetingId}`);
    }

    const handleBoardDetail = (meetingBoardId: string) => {
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    }

    return (
        <div className='festival-board-list'>
            <button onClick={handleCreateBoard}>{"게시물 작성"}</button>
            <ul>
            {boardList.map((board) => (
                    <li key={board.meetingBoardId} onClick={() => handleBoardDetail(board.meetingBoardId)}>
                        프로필이미지: <img
                            src={board.userDto && board.userDto.profileImage ? board.userDto.profileImage : defaultProfileImage}
                            alt="profile"
                        />
                        <h2>제목: {board.title}</h2>
                        <p>{board.content}</p>
                        <p>닉네임: {board.userDto ? board.userDto.nickname : 'Unknown'}</p>
                        <p>작성날짜: {board.createDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
