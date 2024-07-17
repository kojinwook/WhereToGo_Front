import { GetMeetingBoardListRequest } from 'apis/apis';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MeetingBoard from 'types/interface/meeting-board.interface';

export default function BoardList() {

    const {meetingId} = useParams();
    const [boardList, setBoardList] = useState<MeetingBoard[]>([]);

    useEffect(() => {
        if (!meetingId) return;
        const fetchBoardList = async () => {
            const response = await GetMeetingBoardListRequest(meetingId);
            console.log(response?.meetingBoardList.map((board) => board.userDto.nickname));
            if (response && response.code === 'SU') {
                setBoardList(response.meetingBoardList);
            } else {
                console.error('Failed to fetch board list:');
            }
        }
        fetchBoardList();
    }, [])

    return (
        <div>
            <h1>Board List</h1>
            <ul>
                {boardList.map((board) => (
                    <li key={board.meetingBoardId}>
                        <h2>{board.title}</h2>
                        <p>{board.content}</p>
                        <p>{board.userDto.nickname}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
